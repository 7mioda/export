import mysql from 'mysql';
import config from '../config';

const { mySql: { databaseURL } } = config;

export default () => mysql.createConnection(databaseURL);
