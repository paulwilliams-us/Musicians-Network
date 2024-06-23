const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class RsvpsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const rsvps = await db.rsvps.create(
      {
        id: data.id || undefined,

        response: data.response || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await rsvps.setEvent(data.event || null, {
      transaction,
    });

    await rsvps.setUser(data.user || null, {
      transaction,
    });

    return rsvps;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const rsvpsData = data.map((item, index) => ({
      id: item.id || undefined,

      response: item.response || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const rsvps = await db.rsvps.bulkCreate(rsvpsData, { transaction });

    // For each item created, replace relation files

    return rsvps;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const rsvps = await db.rsvps.findByPk(id, {}, { transaction });

    await rsvps.update(
      {
        response: data.response || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await rsvps.setEvent(data.event || null, {
      transaction,
    });

    await rsvps.setUser(data.user || null, {
      transaction,
    });

    return rsvps;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const rsvps = await db.rsvps.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of rsvps) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of rsvps) {
        await record.destroy({ transaction });
      }
    });

    return rsvps;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const rsvps = await db.rsvps.findByPk(id, options);

    await rsvps.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await rsvps.destroy({
      transaction,
    });

    return rsvps;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const rsvps = await db.rsvps.findOne({ where }, { transaction });

    if (!rsvps) {
      return rsvps;
    }

    const output = rsvps.get({ plain: true });

    output.event = await rsvps.getEvent({
      transaction,
    });

    output.user = await rsvps.getUser({
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
        model: db.events,
        as: 'event',
      },

      {
        model: db.users,
        as: 'user',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
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

      if (filter.response) {
        where = {
          ...where,
          response: filter.response,
        };
      }

      if (filter.event) {
        var listItems = filter.event.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          eventId: { [Op.or]: listItems },
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
          count: await db.rsvps.count({
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
      : await db.rsvps.findAndCountAll({
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
          Utils.ilike('rsvps', 'response', query),
        ],
      };
    }

    const records = await db.rsvps.findAll({
      attributes: ['id', 'response'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['response', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.response,
    }));
  }
};
