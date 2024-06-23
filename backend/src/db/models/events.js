const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const events = sequelize.define(
    'events',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      description: {
        type: DataTypes.TEXT,
      },

      start_date: {
        type: DataTypes.DATE,
      },

      end_date: {
        type: DataTypes.DATE,
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

  events.associate = (db) => {
    db.events.belongsToMany(db.rsvps, {
      as: 'rsvps',
      foreignKey: {
        name: 'events_rsvpsId',
      },
      constraints: false,
      through: 'eventsRsvpsRsvps',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.events.hasMany(db.rsvps, {
      as: 'rsvps_event',
      foreignKey: {
        name: 'eventId',
      },
      constraints: false,
    });

    //end loop

    db.events.belongsTo(db.venues, {
      as: 'venue',
      foreignKey: {
        name: 'venueId',
      },
      constraints: false,
    });

    db.events.belongsTo(db.event_organizers, {
      as: 'organizer',
      foreignKey: {
        name: 'organizerId',
      },
      constraints: false,
    });

    db.events.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.events.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return events;
};
