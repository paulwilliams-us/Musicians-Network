const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Event_organizersDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const event_organizers = await db.event_organizers.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        contact_details: data.contact_details || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await event_organizers.setUser(data.user || null, {
      transaction,
    });

    await event_organizers.setEvents(data.events || [], {
      transaction,
    });

    return event_organizers;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const event_organizersData = data.map((item, index) => ({
      id: item.id || undefined,

      name: item.name || null,
      contact_details: item.contact_details || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const event_organizers = await db.event_organizers.bulkCreate(
      event_organizersData,
      { transaction },
    );

    // For each item created, replace relation files

    return event_organizers;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const event_organizers = await db.event_organizers.findByPk(
      id,
      {},
      { transaction },
    );

    await event_organizers.update(
      {
        name: data.name || null,
        contact_details: data.contact_details || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await event_organizers.setUser(data.user || null, {
      transaction,
    });

    await event_organizers.setEvents(data.events || [], {
      transaction,
    });

    return event_organizers;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const event_organizers = await db.event_organizers.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of event_organizers) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of event_organizers) {
        await record.destroy({ transaction });
      }
    });

    return event_organizers;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const event_organizers = await db.event_organizers.findByPk(id, options);

    await event_organizers.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await event_organizers.destroy({
      transaction,
    });

    return event_organizers;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const event_organizers = await db.event_organizers.findOne(
      { where },
      { transaction },
    );

    if (!event_organizers) {
      return event_organizers;
    }

    const output = event_organizers.get({ plain: true });

    output.events_organizer = await event_organizers.getEvents_organizer({
      transaction,
    });

    output.user = await event_organizers.getUser({
      transaction,
    });

    output.events = await event_organizers.getEvents({
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
        model: db.events,
        as: 'events',
        through: filter.events
          ? {
              where: {
                [Op.or]: filter.events.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.events ? true : null,
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('event_organizers', 'name', filter.name),
        };
      }

      if (filter.contact_details) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'event_organizers',
            'contact_details',
            filter.contact_details,
          ),
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
          count: await db.event_organizers.count({
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
      : await db.event_organizers.findAndCountAll({
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
          Utils.ilike('event_organizers', 'name', query),
        ],
      };
    }

    const records = await db.event_organizers.findAll({
      attributes: ['id', 'name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.name,
    }));
  }
};
