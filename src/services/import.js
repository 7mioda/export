import { Readable, Writable } from 'stream';
import { MongoPipe, PipeLineBuilder, getReadStreamFromPath } from '../pipes';

/**
 *
 * @param source {ReadableStream || String}
 * @param enhancers {Array}
 * @param destination {Object || WritableStream}
 * @returns {Writable|module:stream.internal.Writable}
 */

export const importData = (source, enhancers, destination) => {
  const sourceStream =
    source instanceof Readable ? source : getReadStreamFromPath(source);
  let destinationStream;
  if (!(destination instanceof Writable)) {
    const { connection, dbName, docName } = destination;
    destinationStream = new MongoPipe(connection, dbName, docName);
  } else {
    destinationStream = destination;
  }
  const pipeline = new PipeLineBuilder().add(sourceStream);
  enhancers.forEach((enhancer) => pipeline.add(enhancer));
  return pipeline.add(destinationStream).build();
};
