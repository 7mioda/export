import mysql from 'mysql';
import Promise from 'promise';
import { MongoClient } from 'mongodb';

export const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'export',
});

mysqlConnection.connect();


let mongoClient;
const url = 'mongodb://localhost:27017';
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  mongoClient = client;
  return client;
});
export const mongoclient = mongoClient;

export const insertOne = (connection, row) => new Promise((resolve, reject) => {
  connection.query('INSERT INTO clients SET  ?', row, (error, results) => {
    if (error) { reject(error); }
    resolve(results);
  });
});
