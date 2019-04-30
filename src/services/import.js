import fs from 'fs';
import { Readable, Writable } from 'stream';
import chalk from 'chalk';
import parse from 'csv-parser';
import _ from 'lodash';

/**
 *
 * @param path String
 * @returns csv file stream {ReadStream}
 */
export const getReader = (path) => {
  try {
    fs.statSync(path);
    const reader = fs.createReadStream(path);
    reader.setEncoding('utf-8');
    return reader;
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @param connection {MongoClient}
 * @param dbName {String}
 * @param docName {String}
 * @returns {module:stream.internal.Writable}
 */

export const mongoPipe = (connection, dbName, docName) => {
  const db = connection.db(dbName);
  const doc = db.collection(docName);
  const writable = new Writable({
    objectMode: true,
    autoDestroy: true,
    write(chunk, encoding, callback) {
      const row = chunk;
      if (row.id) {
        doc.updateOne(
          { _id: row.id },
          {
            $set: _.mapKeys(row, (value, key) => (key === 'id' ? '_id' : key)),
          },
          { upsert: true }
        );
      } else {
        doc.insertOne(row);
      }
      callback(null, chunk);
    },
  });
  const session = connection.startSession({
    readPreference: { mode: 'primary' },
  });
  writable.on('open', () => {
    session.startTransaction();
  });
  writable.on('end', () => {
    session.commitTransaction();
    session.endSession();
    console.timeEnd(chalk.hex('#fff').bgBlue('Importing Data'));
  });
  return writable;
};

/**
 *
 * @param source {ReadableStream || String}
 * @param destination {Object || WritableStream}
 * @returns {Writable|module:stream.internal.Writable}
 */

export const importData = (source, destination) => {
  const parser = parse({ delimiter: ',' });
  const sourceStream = source instanceof Readable ? source : getReader(source);
  let destinationStream;
  if (!(destination instanceof Writable)) {
    const { connection, dbName, docName } = destination;
    destinationStream = mongoPipe(connection, dbName, docName);
  } else {
    destinationStream = destination;
  }
  sourceStream.pipe(parser).pipe(destinationStream);
  return destinationStream;
};
