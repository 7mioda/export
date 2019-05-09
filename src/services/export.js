import MySqlService from './mySql';
import { UniquePipe, Writer } from './pipes';

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
  const destinationStream = new Writer(MySqlServiceInstance);
  sourceStream.pipe(new UniquePipe(MySqlServiceInstance)).pipe(destinationStream);
  return destinationStream;
};
