const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class ApplicationsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const applications = await db.applications.create(
      {
        id: data.id || undefined,

        status: data.status || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await applications.setJob(data.job || null, {
      transaction,
    });

    await applications.setMusician(data.musician || null, {
      transaction,
    });

    return applications;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const applicationsData = data.map((item, index) => ({
      id: item.id || undefined,

      status: item.status || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const applications = await db.applications.bulkCreate(applicationsData, {
      transaction,
    });

    // For each item created, replace relation files

    return applications;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const applications = await db.applications.findByPk(
      id,
      {},
      { transaction },
    );

    await applications.update(
      {
        status: data.status || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await applications.setJob(data.job || null, {
      transaction,
    });

    await applications.setMusician(data.musician || null, {
      transaction,
    });

    return applications;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const applications = await db.applications.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of applications) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of applications) {
        await record.destroy({ transaction });
      }
    });

    return applications;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const applications = await db.applications.findByPk(id, options);

    await applications.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await applications.destroy({
      transaction,
    });

    return applications;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const applications = await db.applications.findOne(
      { where },
      { transaction },
    );

    if (!applications) {
      return applications;
    }

    const output = applications.get({ plain: true });

    output.job = await applications.getJob({
      transaction,
    });

    output.musician = await applications.getMusician({
      transaction,
    });

    return output;
  }

  static async findAll(filter, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.jobs,
        as: 'job',
      },

      {
        model: db.musicians,
        as: 'musician',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.status) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('applications', 'status', filter.status),
        };
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.job) {
        var listItems = filter.job.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          jobId: { [Op.or]: listItems },
        };
      }

      if (filter.musician) {
        var listItems = filter.musician.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          musicianId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.applications.count({
            where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.applications.findAndCountAll({
          where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('applications', 'status', query),
        ],
      };
    }

    const records = await db.applications.findAll({
      attributes: ['id', 'status'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['status', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.status,
    }));
  }
};
