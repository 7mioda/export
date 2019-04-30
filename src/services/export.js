import { Transform, Writable } from 'stream';
import _ from 'lodash';
import MySqlService from './mySql';

/**
 *
 * @param destination
 * @param buffer
 * @returns {module:stream.internal.Writable}
 */
const getWriter = (destination, buffer) =>
  new Writable({
    objectMode: true,
    autoDestroy: true,
    write(chunk, encoding, callback) {
      const row = JSON.parse(chunk);
      if (row != null) {
        buffer.push(_.mapKeys(row, (value, key) => (key === '_id' ? 'id' : key)));
        if (buffer.length >= 1000) {
          destination.insertMany([...buffer]);
          buffer.length = 0;
        }
        callback(null, row);
      } else {
        callback(null, row);
      }
    },
  });

export const unique = (mySqlService) => {
  const rows = [];
  return new Transform({
    writableObjectMode: true,
    objectMode: true,
    autoDestroy: true,
    encoding: 'utf-8',
    async transform(chunk, encoding, callback) {
      const test = await mySqlService.exists(chunk._id);
      if (test && _.indexOf(rows, chunk._id, 0) === -1) {
        const data = JSON.stringify(chunk);
        rows.push(chunk._id);
        callback(null, data);
      } else {
        callback(null, null);
      }
    },
  });
};

/**
 *
 * @param source
 * @param destination
 * @returns {module:stream.internal.Writable}
 */

export const exportData = (source, destination) => {
  const { connection: mongoConnection, dbName, docName } = source;
  const db = mongoConnection.db(dbName);
  const doc = db.collection(docName);
  const sourceStream = doc.find().stream();
  const { connection, entityName } = destination;
  const MySqlServiceInstance = new MySqlService(connection, entityName);
  const rows = [];
  const destinationStream = getWriter(MySqlServiceInstance, rows);
  destinationStream.on('finish', () => {
    if (rows.length > 0) {
      MySqlServiceInstance.insertMany([...rows]);
    }
  });
  sourceStream.pipe(unique(MySqlServiceInstance)).pipe(destinationStream);
  return destinationStream;
};
