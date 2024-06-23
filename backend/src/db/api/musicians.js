const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class MusiciansDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const musicians = await db.musicians.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        contact_details: data.contact_details || null,
        resume: data.resume || null,
        education_training: data.education_training || null,
        experience: data.experience || null,
        instruments: data.instruments || null,
        awards_credits: data.awards_credits || null,
        Skills: data.Skills || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await musicians.setUser(data.user || null, {
      transaction,
    });

    await musicians.setAvailability(data.availability || [], {
      transaction,
    });

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.musicians.getTableName(),
        belongsToColumn: 'profile_images',
        belongsToId: musicians.id,
      },
      data.profile_images,
      options,
    );

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.musicians.getTableName(),
        belongsToColumn: 'media_samples',
        belongsToId: musicians.id,
      },
      data.media_samples,
      options,
    );

    return musicians;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const musiciansData = data.map((item, index) => ({
      id: item.id || undefined,

      name: item.name || null,
      contact_details: item.contact_details || null,
      resume: item.resume || null,
      education_training: item.education_training || null,
      experience: item.experience || null,
      instruments: item.instruments || null,
      awards_credits: item.awards_credits || null,
      Skills: item.Skills || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const musicians = await db.musicians.bulkCreate(musiciansData, {
      transaction,
    });

    // For each item created, replace relation files

    for (let i = 0; i < musicians.length; i++) {
      await FileDBApi.replaceRelationFiles(
        {
          belongsTo: db.musicians.getTableName(),
          belongsToColumn: 'profile_images',
          belongsToId: musicians[i].id,
        },
        data[i].profile_images,
        options,
      );
    }

    for (let i = 0; i < musicians.length; i++) {
      await FileDBApi.replaceRelationFiles(
        {
          belongsTo: db.musicians.getTableName(),
          belongsToColumn: 'media_samples',
          belongsToId: musicians[i].id,
        },
        data[i].media_samples,
        options,
      );
    }

    return musicians;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const musicians = await db.musicians.findByPk(id, {}, { transaction });

    await musicians.update(
      {
        name: data.name || null,
        contact_details: data.contact_details || null,
        resume: data.resume || null,
        education_training: data.education_training || null,
        experience: data.experience || null,
        instruments: data.instruments || null,
        awards_credits: data.awards_credits || null,
        Skills: data.Skills || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await musicians.setUser(data.user || null, {
      transaction,
    });

    await musicians.setAvailability(data.availability || [], {
      transaction,
    });

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.musicians.getTableName(),
        belongsToColumn: 'profile_images',
        belongsToId: musicians.id,
      },
      data.profile_images,
      options,
    );

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.musicians.getTableName(),
        belongsToColumn: 'media_samples',
        belongsToId: musicians.id,
      },
      data.media_samples,
      options,
    );

    return musicians;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const musicians = await db.musicians.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of musicians) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of musicians) {
        await record.destroy({ transaction });
      }
    });

    return musicians;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const musicians = await db.musicians.findByPk(id, options);

    await musicians.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await musicians.destroy({
      transaction,
    });

    return musicians;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const musicians = await db.musicians.findOne({ where }, { transaction });

    if (!musicians) {
      return musicians;
    }

    const output = musicians.get({ plain: true });

    output.applications_musician = await musicians.getApplications_musician({
      transaction,
    });

    output.availability_musician = await musicians.getAvailability_musician({
      transaction,
    });

    output.user = await musicians.getUser({
      transaction,
    });

    output.profile_images = await musicians.getProfile_images({
      transaction,
    });

    output.media_samples = await musicians.getMedia_samples({
      transaction,
    });

    output.availability = await musicians.getAvailability({
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
        model: db.availability,
        as: 'availability',
        through: filter.availability
          ? {
              where: {
                [Op.or]: filter.availability.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.availability ? true : null,
      },

      {
        model: db.file,
        as: 'profile_images',
      },

      {
        model: db.file,
        as: 'media_samples',
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
          [Op.and]: Utils.ilike('musicians', 'name', filter.name),
        };
      }

      if (filter.contact_details) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'musicians',
            'contact_details',
            filter.contact_details,
          ),
        };
      }

      if (filter.resume) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('musicians', 'resume', filter.resume),
        };
      }

      if (filter.education_training) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'musicians',
            'education_training',
            filter.education_training,
          ),
        };
      }

      if (filter.experience) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('musicians', 'experience', filter.experience),
        };
      }

      if (filter.instruments) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('musicians', 'instruments', filter.instruments),
        };
      }

      if (filter.awards_credits) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'musicians',
            'awards_credits',
            filter.awards_credits,
          ),
        };
      }

      if (filter.Skills) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('musicians', 'Skills', filter.Skills),
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
          count: await db.musicians.count({
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
      : await db.musicians.findAndCountAll({
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
          Utils.ilike('musicians', 'name', query),
        ],
      };
    }

    const records = await db.musicians.findAll({
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
