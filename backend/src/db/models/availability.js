const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const availability = sequelize.define(
    'availability',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      available_from: {
        type: DataTypes.DATE,
      },

      available_to: {
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

  availability.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.availability.belongsTo(db.musicians, {
      as: 'musician',
      foreignKey: {
        name: 'musicianId',
      },
      constraints: false,
    });

    db.availability.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.availability.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return availability;
};
