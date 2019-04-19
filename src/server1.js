import http from 'http';
import url from 'url';
import fs from 'fs';
import parse from 'csv-parser';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { mongoClient as client, mysqlConnection as connection } from './database';
import { importData, mongoPipe, normaliser } from './utils/util';

require('babel-polyfill');


const server1 = http.createServer(async (request, response) => {


    const mongoPipeInstance = mongoPipe(doc);
    reader.pipe(parser).pipe(normaliserInstance).pipe(mongoPipeInstance);
    parser.on('error', (err) => {
      console.error(err.message);
    });
    reader.on('error', (err) => {
      console.error(err.message);
    });
    normaliserInstance.on('end', () => {
      session.commitTransaction();
      session.endSession(importData(connection, entityName, doc));
      console.timeEnd(chalk.hex('#fff').bgBlue('Importing Data'));
    });
    normaliserInstance.on('error', error => console.log(error));
    mongoPipeInstance.on('error', error => console.log(error));
    response.setHeader('OK', 200);
    response.end('Processing Data');
  } catch (error) {
    console.log(error);
    response.setHeader(204);
    response.end('File not found');
  }
});

dotenv.config();
const PORT = process.env.Port || 7000;
server1.listen(PORT);
server1.on('listening', () => console.log(chalk.whiteBright.bgBlueBright(`   Server is running on ${PORT} :D   `)));
server1.on('error', error => console.log(chalk.hex('#fff').bgBlueBright(JSON.stringify(error, null, 2))));
