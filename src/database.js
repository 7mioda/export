import mysql from 'mysql';
import Promise from 'promise';
import { MongoClient } from 'mongodb';

import { log } from './logger';

export const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'export',
});

mysqlConnection.connect();


export let mongoClient;
const url = 'mongodb://localhost:27017';
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  mongoClient = client;
  return client;
});

export const insertOne = (connection, table, row) => new Promise((resolve) => {
  connection.query(`INSERT INTO ${table} SET  ?`, row, (error, results) => {
    if (error) { log(error); }
    resolve(results);
  });
});
