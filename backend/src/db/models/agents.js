const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const agents = sequelize.define(
    'agents',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      business_info: {
        type: DataTypes.TEXT,
      },

      contact_details: {
        type: DataTypes.TEXT,
      },

      Contact_Email: {
        type: DataTypes.TEXT,
      },

      Contact_Number: {
        type: DataTypes.TEXT,
      },

      Business_Name: {
        type: DataTypes.TEXT,
      },

      Address: {
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

  agents.associate = (db) => {
    db.agents.belongsToMany(db.musicians, {
      as: 'musicians',
      foreignKey: {
        name: 'agents_musiciansId',
      },
      constraints: false,
      through: 'agentsMusiciansMusicians',
    });

    db.agents.belongsToMany(db.jobs, {
      as: 'jobs',
      foreignKey: {
        name: 'agents_jobsId',
      },
      constraints: false,
      through: 'agentsJobsJobs',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.agents.belongsTo(db.users, {
      as: 'user',
      foreignKey: {
        name: 'userId',
      },
      constraints: false,
    });

    db.agents.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.agents.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return agents;
};
