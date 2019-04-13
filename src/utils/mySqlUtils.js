import Promise from 'promise';
import chalk from 'chalk';
import { log } from './logger';

export const exists = (connection, table, row) => new Promise((resolve) => {
  connection.query(`SELECT * FROM ${table} WHERE id = "${row.id}"`, (error, results) => {
    if (error) {
      console.log(chalk.whiteBright.bgRedBright('MySql Select(exists) Error :/ Check Log file for further information'));
      log(error);
    }
    resolve(results || []);
  });
});

export const insertOne = (connection, table, row) => new Promise((resolve) => {
  connection.query(`INSERT INTO ${table} SET  ?`, row, (error, results) => {
    if (error) {
      console.log(chalk.whiteBright.bgRedBright('MySql Insertion Error :/ Check Log file for further information'));
      log(error);
    }
    resolve(results);
  });
});


export const insertMany = (connection, entityName, query, rows) => new Promise((resolve) => {
  connection.query({ sql: `INSERT INTO ${entityName} ${query}` }, [rows], (error, results) => {
    if (error) {
      console.log(chalk.whiteBright.bgRedBright('MySql Insertion(insertMany) Error :/ Check Log file for further information'));
      log(error);
    }
    resolve(results);
  });
});
export const insertManyTransaction = (connection, entityName, query, rows) => new Promise((resolve) => {
  connection.beginTransaction((err) => {
    if (err) {
      console.log(chalk.whiteBright.bgRedBright('MySql Insertion Transaction Error :/ Check Log file for further information'));
      log(err);
    }

    rows.forEach((row) => {
      try {
        insertOne(connection, entityName, row);
      } catch (error) {
        console.log(chalk.whiteBright.bgRedBright('MySql row Insertion  Error :/ Check Log file for further information'));
        log(err);
      }
    });


    connection.commit((errr) => {
      if (errr) {
        return connection.rollback(() => {
          throw errr;
        });
      }
      console.log('success!');
    });
  });
});
