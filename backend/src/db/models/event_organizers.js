const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const event_organizers = sequelize.define(
    'event_organizers',
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

  event_organizers.associate = (db) => {
    db.event_organizers.belongsToMany(db.events, {
      as: 'events',
      foreignKey: {
        name: 'event_organizers_eventsId',
      },
      constraints: false,
      through: 'event_organizersEventsEvents',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.event_organizers.hasMany(db.events, {
      as: 'events_organizer',
      foreignKey: {
        name: 'organizerId',
      },
      constraints: false,
    });

    //end loop

    db.event_organizers.belongsTo(db.users, {
      as: 'user',
      foreignKey: {
        name: 'userId',
      },
      constraints: false,
    });

    db.event_organizers.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.event_organizers.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return event_organizers;
};
