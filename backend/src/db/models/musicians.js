const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const musicians = sequelize.define(
    'musicians',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      contact_details: {
        type: DataTypes.TEXT,
      },

      resume: {
        type: DataTypes.TEXT,
      },

      education_training: {
        type: DataTypes.TEXT,
      },

      experience: {
        type: DataTypes.TEXT,
      },

      instruments: {
        type: DataTypes.TEXT,
      },

      awards_credits: {
        type: DataTypes.TEXT,
      },

      Skills: {
        type: DataTypes.TEXT,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  musicians.associate = (db) => {
    db.musicians.belongsToMany(db.availability, {
      as: 'availability',
      foreignKey: {
        name: 'musicians_availabilityId',
      },
      constraints: false,
      through: 'musiciansAvailabilityAvailability',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.musicians.hasMany(db.applications, {
      as: 'applications_musician',
      foreignKey: {
        name: 'musicianId',
      },
      constraints: false,
    });

    db.musicians.hasMany(db.availability, {
      as: 'availability_musician',
      foreignKey: {
        name: 'musicianId',
      },
      constraints: false,
    });

    //end loop

    db.musicians.belongsTo(db.users, {
      as: 'user',
      foreignKey: {
        name: 'userId',
      },
      constraints: false,
    });

    db.musicians.hasMany(db.file, {
      as: 'profile_images',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: db.musicians.getTableName(),
        belongsToColumn: 'profile_images',
      },
    });

    db.musicians.hasMany(db.file, {
      as: 'media_samples',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: db.musicians.getTableName(),
        belongsToColumn: 'media_samples',
      },
    });

    db.musicians.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.musicians.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return musicians;
};
