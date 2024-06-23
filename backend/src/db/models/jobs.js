const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const jobs = sequelize.define(
    'jobs',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      title: {
        type: DataTypes.TEXT,
      },

      description: {
        type: DataTypes.TEXT,
      },

      location: {
        type: DataTypes.TEXT,
      },

      date: {
        type: DataTypes.DATE,
      },

      payment: {
        type: DataTypes.DECIMAL,
      },

      instrument: {
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

  jobs.associate = (db) => {
    db.jobs.belongsToMany(db.applications, {
      as: 'applications',
      foreignKey: {
        name: 'jobs_applicationsId',
      },
      constraints: false,
      through: 'jobsApplicationsApplications',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.jobs.hasMany(db.applications, {
      as: 'applications_job',
      foreignKey: {
        name: 'jobId',
      },
      constraints: false,
    });

    //end loop

    db.jobs.belongsTo(db.users, {
      as: 'posted_by',
      foreignKey: {
        name: 'posted_byId',
      },
      constraints: false,
    });

    db.jobs.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.jobs.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return jobs;
};
