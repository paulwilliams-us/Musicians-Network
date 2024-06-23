const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const venues = sequelize.define(
    'venues',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      location: {
        type: DataTypes.TEXT,
      },

      capacity: {
        type: DataTypes.INTEGER,
      },

      equipment: {
        type: DataTypes.TEXT,
      },

      event_types: {
        type: DataTypes.TEXT,
      },

      Venue_Type: {
        type: DataTypes.TEXT,
      },

      Address: {
        type: DataTypes.TEXT,
      },

      About: {
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

  venues.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.venues.hasMany(db.events, {
      as: 'events_venue',
      foreignKey: {
        name: 'venueId',
      },
      constraints: false,
    });

    //end loop

    db.venues.belongsTo(db.users, {
      as: 'user',
      foreignKey: {
        name: 'userId',
      },
      constraints: false,
    });

    db.venues.hasMany(db.file, {
      as: 'images',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: db.venues.getTableName(),
        belongsToColumn: 'images',
      },
    });

    db.venues.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.venues.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return venues;
};
