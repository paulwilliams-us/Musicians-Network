const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const rsvps = sequelize.define(
    'rsvps',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      response: {
        type: DataTypes.ENUM,

        values: ['not_attending', 'maybe_attending', 'attending'],
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

  rsvps.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.rsvps.belongsTo(db.events, {
      as: 'event',
      foreignKey: {
        name: 'eventId',
      },
      constraints: false,
    });

    db.rsvps.belongsTo(db.users, {
      as: 'user',
      foreignKey: {
        name: 'userId',
      },
      constraints: false,
    });

    db.rsvps.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.rsvps.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return rsvps;
};
