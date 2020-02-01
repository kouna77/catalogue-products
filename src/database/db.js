var mysql= require('mysql');
require('dotenv/config')
/*
* @param {object} options
* @param {string} [options.host]
* @param {string} [options.user]
* @param {string} [options.password]
* @param {string} [options.database]
**/
var Database = function (options) {
  this.connection = mysql.createConnection({
    host     : process.env.VUE_APP_HOST,
    user     : process.env.VUE_APP_USER,
    password : process.env.VUE_APP_PASSWORD,
    database : process.env.VUE_APP_DATABASE
  });
  this.connection.connect()
}


Database.prototype.connect = function () {
  this.connection.connect()
}

Database.prototype.query = function (sql, params) {
  return new Promise((resolve, reject) => {
    this.connection.query(sql, params, (error, results) => {
      if (error) {
        reject(error)
        return false
      }
      resolve(results)
    })
  })
}

Database.prototype.close = function () {
  this.connection.end()
}

module.exports = Database
