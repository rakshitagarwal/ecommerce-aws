const Sequelize = require('sequelize');

const sequelize = new Sequelize('backend', 'root', 'password', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
