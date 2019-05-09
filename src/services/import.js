import fs from 'fs';
import { Readable, Writable, pipeline  as pipelineWithCb } from 'stream';
import { promisify } from 'util';
import parse from 'csv-parser';
import { MongoPipe } from './pipes';

const pipeline = promisify(pipelineWithCb);

class PipelineBuilder {
  constructor () {
    this.pipes = []
  }

  add (pipe) {
    this.pipes.push(pipe);
    return this;
  }

  build () {
    return pipeline(...this.pipes);
  }
}

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
    destinationStream = new MongoPipe(connection, dbName, docName);
  } else {
    destinationStream = destination;
  }
  return new PipelineBuilder().add(sourceStream).add(parser).add(destinationStream).build();
};
