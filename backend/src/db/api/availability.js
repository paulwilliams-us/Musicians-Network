const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class AvailabilityDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const availability = await db.availability.create(
      {
        id: data.id || undefined,

        available_from: data.available_from || null,
        available_to: data.available_to || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await availability.setMusician(data.musician || null, {
      transaction,
    });

    return availability;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const availabilityData = data.map((item, index) => ({
      id: item.id || undefined,

      available_from: item.available_from || null,
      available_to: item.available_to || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const availability = await db.availability.bulkCreate(availabilityData, {
      transaction,
    });

    // For each item created, replace relation files

    return availability;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const availability = await db.availability.findByPk(
      id,
      {},
      { transaction },
    );

    await availability.update(
      {
        available_from: data.available_from || null,
        available_to: data.available_to || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await availability.setMusician(data.musician || null, {
      transaction,
    });

    return availability;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const availability = await db.availability.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of availability) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of availability) {
        await record.destroy({ transaction });
      }
    });

    return availability;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const availability = await db.availability.findByPk(id, options);

    await availability.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await availability.destroy({
      transaction,
    });

    return availability;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const availability = await db.availability.findOne(
      { where },
      { transaction },
    );

    if (!availability) {
      return availability;
    }

    const output = availability.get({ plain: true });

    output.musician = await availability.getMusician({
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

      if (filter.calendarStart && filter.calendarEnd) {
        where = {
          ...where,
          [Op.or]: [
            {
              available_from: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
            {
              available_to: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
          ],
        };
      }

      if (filter.available_fromRange) {
        const [start, end] = filter.available_fromRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            available_from: {
              ...where.available_from,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            available_from: {
              ...where.available_from,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.available_toRange) {
        const [start, end] = filter.available_toRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            available_to: {
              ...where.available_to,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            available_to: {
              ...where.available_to,
              [Op.lte]: end,
            },
          };
        }
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
          count: await db.availability.count({
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
      : await db.availability.findAndCountAll({
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
          Utils.ilike('availability', 'available_from', query),
        ],
      };
    }

    const records = await db.availability.findAll({
      attributes: ['id', 'available_from'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['available_from', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.available_from,
    }));
  }
};
