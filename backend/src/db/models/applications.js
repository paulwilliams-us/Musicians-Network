const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const applications = sequelize.define(
    'applications',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      status: {
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

  applications.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.applications.belongsTo(db.jobs, {
      as: 'job',
      foreignKey: {
        name: 'jobId',
      },
      constraints: false,
    });

    db.applications.belongsTo(db.musicians, {
      as: 'musician',
      foreignKey: {
        name: 'musicianId',
      },
      constraints: false,
    });

    db.applications.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.applications.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return applications;
};
