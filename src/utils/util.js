import { Transform, Writable } from 'stream';
import chalk from 'chalk';
import _ from 'lodash';
import { exists, insertMany } from './mySqlUtils';


//------------------------------------------------------------
//         Helper functions
//------------------------------------------------------------


export const reformatData = (object, formatter) => _.mapValues(object, value => (formatter(value)));
export const normalize = object => _.mapKeys(object, (value, key) => ((key === '_id') ? 'id' : key));
export const queryBuilder = entity => `(${_.keys(normalize(entity)).join(' , ')}) VALUES ? `;
export const queryParams = object => _.values(object);
export const dataValidator = async (connection, table, row) => { const test = await exists(connection, table, row); return test.length > 0; };


//------------------------------------------------------------
//         Data Pipes
//------------------------------------------------------------


export const unique = (connection, entityName, rows = []) => new Transform({
  writableObjectMode: true,
  objectMode: true,
  autoDestroy: true,
  encoding: 'utf-8',
  async transform(chunk, encoding, callback) {
    const row = normalize(chunk);
    const test = await dataValidator(connection, entityName, row);
    const data = JSON.stringify(reformatData(chunk, value => value));
    if ((!test) && (_.indexOf(rows, row.id, 0))) {
      rows.push(row.id);
      callback(null, data);
    } else {
      callback(null, null);
    }
  },
});




export const mongoPipe = doc => new Writable({
  objectMode: true,
  autoDestroy: true,
  write(chunk, encoding, callback) {
    const row = JSON.parse(chunk);
    (row.id)
      ? doc.updateOne({ _id: row.id }, { $set: _.mapKeys(row, (value, key) => ((key === 'id') ? '_id' : key)) }, { upsert: true })
      : doc.insertOne(row);
    callback(null, chunk);
  },
});


export const mySqlPipe = (connection, entityName, rows) => new Writable({
  objectMode: true,
  autoDestroy: true,
  write(chunk, encoding, callback) {
    const row = JSON.parse(chunk);
    if (row != null) {
      rows.push(queryParams(row));
      if (rows.length >= 1000) {
        const query = queryBuilder(row);
        insertMany(connection, entityName, query, [...rows]);
        rows.length = 0;
      }
      callback(null, row);
    } else {
      callback(null, row);
    }
  },
});


//------------------------------------------------------------
//         Main Data import function
//------------------------------------------------------------
export const importData = (connection, entityName, source) => {
  let rows = [];
  let query;
  console.log(chalk.hex('#fff').bgBlue(('   Exporting Data to MySql   ')));
  console.time(chalk.hex('#fff').bgBlue(('Exporting Data')));
  const mySqlPipeInstance = mySqlPipe(connection, entityName, rows);
  const dataStream = source.find().batchSize(10).stream();
  dataStream.pipe(unique(connection, entityName)).pipe(mySqlPipeInstance);
  dataStream.once('data', (data) => { query = queryBuilder(data); return data; });

  mySqlPipeInstance.on('finish', () => {
    if (rows.length > 0) {
      insertMany(connection, entityName, query, [...rows]);
      rows = [];
      console.timeEnd(chalk.hex('#fff').bgBlue(('Exporting Data')));
    }
  });
  dataStream.on('error', (error) => {
    console.log('importData data-stream', error);
  });
};
