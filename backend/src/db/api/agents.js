const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class AgentsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const agents = await db.agents.create(
      {
        id: data.id || undefined,

        business_info: data.business_info || null,
        contact_details: data.contact_details || null,
        Contact_Email: data.Contact_Email || null,
        Contact_Number: data.Contact_Number || null,
        Business_Name: data.Business_Name || null,
        Address: data.Address || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await agents.setUser(data.user || null, {
      transaction,
    });

    await agents.setMusicians(data.musicians || [], {
      transaction,
    });

    await agents.setJobs(data.jobs || [], {
      transaction,
    });

    return agents;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const agentsData = data.map((item, index) => ({
      id: item.id || undefined,

      business_info: item.business_info || null,
      contact_details: item.contact_details || null,
      Contact_Email: item.Contact_Email || null,
      Contact_Number: item.Contact_Number || null,
      Business_Name: item.Business_Name || null,
      Address: item.Address || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const agents = await db.agents.bulkCreate(agentsData, { transaction });

    // For each item created, replace relation files

    return agents;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const agents = await db.agents.findByPk(id, {}, { transaction });

    await agents.update(
      {
        business_info: data.business_info || null,
        contact_details: data.contact_details || null,
        Contact_Email: data.Contact_Email || null,
        Contact_Number: data.Contact_Number || null,
        Business_Name: data.Business_Name || null,
        Address: data.Address || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await agents.setUser(data.user || null, {
      transaction,
    });

    await agents.setMusicians(data.musicians || [], {
      transaction,
    });

    await agents.setJobs(data.jobs || [], {
      transaction,
    });

    return agents;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const agents = await db.agents.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of agents) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of agents) {
        await record.destroy({ transaction });
      }
    });

    return agents;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const agents = await db.agents.findByPk(id, options);

    await agents.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await agents.destroy({
      transaction,
    });

    return agents;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const agents = await db.agents.findOne({ where }, { transaction });

    if (!agents) {
      return agents;
    }

    const output = agents.get({ plain: true });

    output.user = await agents.getUser({
      transaction,
    });

    output.musicians = await agents.getMusicians({
      transaction,
    });

    output.jobs = await agents.getJobs({
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
        model: db.users,
        as: 'user',
      },

      {
        model: db.musicians,
        as: 'musicians',
        through: filter.musicians
          ? {
              where: {
                [Op.or]: filter.musicians.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.musicians ? true : null,
      },

      {
        model: db.jobs,
        as: 'jobs',
        through: filter.jobs
          ? {
              where: {
                [Op.or]: filter.jobs.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.jobs ? true : null,
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.business_info) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'agents',
            'business_info',
            filter.business_info,
          ),
        };
      }

      if (filter.contact_details) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'agents',
            'contact_details',
            filter.contact_details,
          ),
        };
      }

      if (filter.Contact_Email) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'agents',
            'Contact_Email',
            filter.Contact_Email,
          ),
        };
      }

      if (filter.Contact_Number) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'agents',
            'Contact_Number',
            filter.Contact_Number,
          ),
        };
      }

      if (filter.Business_Name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'agents',
            'Business_Name',
            filter.Business_Name,
          ),
        };
      }

      if (filter.Address) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('agents', 'Address', filter.Address),
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

      if (filter.user) {
        var listItems = filter.user.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          userId: { [Op.or]: listItems },
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
          count: await db.agents.count({
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
      : await db.agents.findAndCountAll({
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
          Utils.ilike('agents', 'Business_Name', query),
        ],
      };
    }

    const records = await db.agents.findAll({
      attributes: ['id', 'Business_Name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['Business_Name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.Business_Name,
    }));
  }
};
