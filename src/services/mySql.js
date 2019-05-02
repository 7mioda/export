import Promise from 'promise';
import _ from 'lodash';

export default class MySqlService {
  constructor(connection, table) {
    this.connection = connection;
    this.table = table;
    this.query = null;
  }

  /**
   *
   * @param row {Array}
   * @returns {Promise}
   */
  insertOne(row) {
    return new Promise((resolve) => {
      this.connection.query(
        `INSERT INTO ${this.table} SET  ?`,
        MySqlService.queryParams(row),
        (error, results) => {
          if (error) {
            throw error;
          }
          resolve(results);
        }
      );
    });
  }

  /**
   *
   * @param rows {Array}
   * @returns {Promise}
   */
  insertMany(rows) {
    return new Promise((resolve) => {
      const params = rows.map((row) => MySqlService.queryParams(row));
      this.connection.query(
        { sql: `INSERT INTO ${this.table} ${MySqlService.getQuery(rows[0])}` },
        [params],
        (error, results) => {
          if (error) {
            throw error;
          }
          resolve(results);
        }
      );
    });
  }

  /**
   *
   * @param id {String}
   * @returns {Promise}
   */
  exists(id) {
    return new Promise((resolve) => {
      this.connection.query(
        `SELECT * FROM ${this.table} WHERE id = "${id}"`,
        (error, results) => {
          if (error) {
            throw error;
          }
          resolve(results.length === 0);
        }
      );
    });
  }

  /**
   *
   * @param row {Array}
   * @returns {string|*}
   */
  static getQuery(row) {
    if (!this.query) {
      this.query = this.queryBuilder(row);
    }
    return this.query;
  }

  /**
   *
   * @param row {Array}
   * @returns {Array}
   */
  static queryParams(row) {
    return _.values(row);
  }

  /**
   *
   * @param ro {Array}
   * @returns {string}
   */
  static queryBuilder(ro) {
    return `(${_.keys(ro).join(' , ')}) VALUES ? `;
  }
}
