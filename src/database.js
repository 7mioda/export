import mysql from 'mysql';
import { MongoClient } from 'mongodb';
import chalk from 'chalk';

import { log } from './utils/logger';

//------------------------------------------------------------
//         MySql Connection
//------------------------------------------------------------

export const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'export',
});
mysqlConnection.connect((error) => {
  if (error) {
    console.log(chalk.whiteBright.bgRedBright('MySql Connection Error :/ Check Log file for further information'));
    log(error);
  } else {
    console.log(chalk.whiteBright.bgBlueBright('   MySql Connected  :D  '));
  }
});

mysqlConnection.on('error', (error) => {
  console.log(chalk.whiteBright.bgRedBright('MySql Connection Error :/ Check Log file for further information'));
  log(error);
});

//------------------------------------------------------------
//        Mongo Connection
//------------------------------------------------------------
export let mongoClient;
const url = 'mongodb://localhost:27017';
MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    log(`Mongodb Connection Error :${JSON.stringify(error, null, 2)}`);
    console.log(chalk.whiteBright.bgRedBright('Mongodb Connection Error :/ Check Log file for further information'));
  } else {
    console.log(chalk.whiteBright.bgBlueBright('   Mongodb Connected  :D   '));
  }
  mongoClient = client;
  return client;
});
