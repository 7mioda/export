import Promise from 'promise';
import _ from 'lodash';


export default class MySqlService {
  constructor(connection, table) {
    this.connection = connection;
    this.table = table;
    this.query = null;
  }

  insertOne(row) {
    return new Promise((resolve) => {
      this.connection.query(`INSERT INTO ${this.table} SET  ?`, MySqlService.queryParams(row), (error, results) => {
        if (error) {
          throw (error);
        }
        resolve(results);
      });
    });
  }

  insertMany(rows) {
    return new Promise((resolve) => {
      const params = rows.map(row => MySqlService.queryParams(row));
      this.connection.query({ sql: `INSERT INTO ${this.table} ${MySqlService.getQuery(rows[0])}` }, [params], (error, results) => {
        if (error) {
          throw (error);
        }
        resolve(results);
      });
    });
  }

  exists(id) {
    return new Promise((resolve) => {
      this.connection.query(`SELECT * FROM ${this.table} WHERE id = "${id}"`, (error, results) => {
        if (error) {
          throw (error);
        }
        resolve(results.length === 0);
      });
    });
  }

  static getQuery(row) {
    if (!this.query) {
      this.query = this.queryBuilder(row);
    }
    return this.query;
  }

  static queryParams(row) {
    return _.values(row);
  }

  static queryBuilder(row) {
    return `(${_.keys(row).join(' , ')}) VALUES ? `;
  }
}
