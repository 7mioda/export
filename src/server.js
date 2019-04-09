import http from 'http';
import url from 'url';
import _ from 'lodash';
import fs from 'fs';
import parse from 'csv-parser';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { mongoClient as client, mysqlConnection as connection } from './database';
import { importData } from './util';

require('babel-polyfill');


const server = http.createServer(async (request, response) => {
  const queryString = url.parse(request.url, true).query;
  const entityName = queryString.entity_name;
  const dbName = 'export';
  const db = client.db(dbName);
  const session = client.startSession({ readPreference: { mode: 'primary' } });
  session.startTransaction();
  const doc = db.collection(entityName);
  try {
    fs.statSync(`./${entityName}.csv`);
    const parser = parse({ delimiter: ',' });
    const reader = fs.createReadStream(`./${entityName}.csv`);
    reader.setEncoding('utf-8');
    reader.on('open', () => {
      console.time(chalk.hex('#fff').bgBlue(('Exporting Data')));
    });

    reader.pipe(parser);
    parser.on('readable', () => {
      let record = parser.read();
      while (record) {
        (record.id)
          ? doc.updateOne({ _id: record.id }, { $set: _.mapKeys(record, (value, key) => ((key === 'id') ? '_id' : key)) }, { upsert: true })
          : doc.insertOne(record);
        record = parser.read();
      }
    });
    parser.on('error', (err) => {
      console.error(err.message);
    });
    reader.on('error', (err) => {
      console.error(err.message);
    });
    parser.on('end', () => {
      session.commitTransaction();
      session.endSession();
      console.timeEnd(chalk.hex('#fff').bgBlue('Exporting Data'));
      importData(connection, entityName, doc);
    });
    response.setHeader('OK', 200);
    response.end('Processing Data');
  } catch (error) {
    response.setHeader(204);
    response.end('File not found');
  }
});

dotenv.config();

server.listen(process.env.Port || 7000);
server.on('listening', () => console.log(chalk.hex('#fff').bgBlueBright('everything is ok')));
server.on('error', error => console.log(chalk.hex('#fff').bgBlueBright(JSON.stringify(error, null, 2))));
