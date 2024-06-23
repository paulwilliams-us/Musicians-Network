const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class VenuesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const venues = await db.venues.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        location: data.location || null,
        capacity: data.capacity || null,
        equipment: data.equipment || null,
        event_types: data.event_types || null,
        Venue_Type: data.Venue_Type || null,
        Address: data.Address || null,
        About: data.About || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await venues.setUser(data.user || null, {
      transaction,
    });

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.venues.getTableName(),
        belongsToColumn: 'images',
        belongsToId: venues.id,
      },
      data.images,
      options,
    );

    return venues;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const venuesData = data.map((item, index) => ({
      id: item.id || undefined,

      name: item.name || null,
      location: item.location || null,
      capacity: item.capacity || null,
      equipment: item.equipment || null,
      event_types: item.event_types || null,
      Venue_Type: item.Venue_Type || null,
      Address: item.Address || null,
      About: item.About || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const venues = await db.venues.bulkCreate(venuesData, { transaction });

    // For each item created, replace relation files

    for (let i = 0; i < venues.length; i++) {
      await FileDBApi.replaceRelationFiles(
        {
          belongsTo: db.venues.getTableName(),
          belongsToColumn: 'images',
          belongsToId: venues[i].id,
        },
        data[i].images,
        options,
      );
    }

    return venues;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const venues = await db.venues.findByPk(id, {}, { transaction });

    await venues.update(
      {
        name: data.name || null,
        location: data.location || null,
        capacity: data.capacity || null,
        equipment: data.equipment || null,
        event_types: data.event_types || null,
        Venue_Type: data.Venue_Type || null,
        Address: data.Address || null,
        About: data.About || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await venues.setUser(data.user || null, {
      transaction,
    });

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.venues.getTableName(),
        belongsToColumn: 'images',
        belongsToId: venues.id,
      },
      data.images,
      options,
    );

    return venues;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const venues = await db.venues.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of venues) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of venues) {
        await record.destroy({ transaction });
      }
    });

    return venues;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const venues = await db.venues.findByPk(id, options);

    await venues.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await venues.destroy({
      transaction,
    });

    return venues;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const venues = await db.venues.findOne({ where }, { transaction });

    if (!venues) {
      return venues;
    }

    const output = venues.get({ plain: true });

    output.events_venue = await venues.getEvents_venue({
      transaction,
    });

    output.user = await venues.getUser({
      transaction,
    });

    output.images = await venues.getImages({
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
        model: db.file,
        as: 'images',
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
          [Op.and]: Utils.ilike('venues', 'name', filter.name),
        };
      }

      if (filter.location) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('venues', 'location', filter.location),
        };
      }

      if (filter.equipment) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('venues', 'equipment', filter.equipment),
        };
      }

      if (filter.event_types) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('venues', 'event_types', filter.event_types),
        };
      }

      if (filter.Venue_Type) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('venues', 'Venue_Type', filter.Venue_Type),
        };
      }

      if (filter.Address) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('venues', 'Address', filter.Address),
        };
      }

      if (filter.About) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('venues', 'About', filter.About),
        };
      }

      if (filter.capacityRange) {
        const [start, end] = filter.capacityRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            capacity: {
              ...where.capacity,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            capacity: {
              ...where.capacity,
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
          count: await db.venues.count({
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
      : await db.venues.findAndCountAll({
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
          Utils.ilike('venues', 'name', query),
        ],
      };
    }

    const records = await db.venues.findAll({
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
