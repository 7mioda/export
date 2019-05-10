import MySqlService from './mySql';
import { UniquePipe, MysqlPipe, PipeLineBuilder } from '../pipes';

/**
 *
 * @param source
 * @param enhancers {Array}
 * @param destination
 * @returns {module:stream.internal.Writable}
 */

export const exportData = (source, enhancers, destination) => {
  const { connection: mongoConnection, dbName, docName } = source;
  const db = mongoConnection.db(dbName);
  const doc = db.collection(docName);
  const sourceStream = doc.find().stream();
  const { connection, entityName } = destination;
  const MySqlServiceInstance = new MySqlService(connection, entityName);
  const destinationStream = new MysqlPipe(MySqlServiceInstance);
  const pipeline = new PipeLineBuilder()
    .add(sourceStream)
    .add(new UniquePipe(MySqlServiceInstance));
  enhancers.forEach((enhancer) => pipeline.add(enhancer));
  return pipeline.add(destinationStream).build();
};
