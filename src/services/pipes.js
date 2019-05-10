import { pipeline as pipelineWithCb, Transform, Writable } from 'stream';
import _ from 'lodash';
import { promisify } from 'util';
import fs from 'fs';

/**
 *
 * @param path String
 * @param option
 * @returns file stream {ReadStream}
 */
// eslint-disable-next-line no-unused-vars
export const getReadStreamFromPath = (path, option = { encoding: 'utf-8' }) => {
  try {
    fs.statSync(path);
    return fs.createReadStream(path, option);
  } catch (error) {
    throw error;
  }
};

export class Writer extends Writable {
  constructor(destination, chunkSize = 1000) {
    super({
      objectMode: true,
      autoDestroy: true,
    });
    this.buffer = [];
    this.destination = destination;
    this.chunkSize = chunkSize;
  }

  _write(chunk, encoding, callback) {
    const row = JSON.parse(chunk);
    if (row != null) {
      this.buffer.push(
        _.mapKeys(row, (value, key) => (key === '_id' ? 'id' : key))
      );
      if (this.buffer.length >= this.chunkSize) {
        this.destination.insertMany([...this.buffer]);
        this.buffer.length = 0;
      }
      callback(null, row);
    } else {
      callback(null, row);
    }
  }

  _destroy(error, callback) {
    try {
      if (this.buffer.length > 0) {
        this.destination.insertMany([...this.buffer]);
      }
    } catch (err) {
      callback(err);
    }
  }
}
export class UniquePipe extends Transform {
  constructor(mySqlService) {
    super({
      writableObjectMode: true,
      objectMode: true,
      autoDestroy: true,
      encoding: 'utf-8',
    });
    this.mySqlService = mySqlService;
    this.rows = [];
  }

  _transform(chunk, encoding, callback) {
    this.mySqlService.exists(chunk._id).then((test) => {
      if (test && _.indexOf(this.rows, chunk._id, 0) === -1) {
        const data = JSON.stringify(chunk);
        this.rows.push(chunk._id);
        callback(null, data);
      } else {
        callback(null, null);
      }
    });
  }
}

export class MongoPipe extends Writable {
  constructor(connection, dbName, docName) {
    super({
      objectMode: true,
      autoDestroy: true,
    });
    this.db = connection.db(dbName);
    this.doc = this.db.collection(docName);
    this.session = connection.startSession({
      readPreference: { mode: 'primary' },
    });
    this.session.startTransaction();
  }

  _write(chunk, encoding, callback) {
    const row = chunk;
    if (row.id) {
      this.doc.updateOne(
        { _id: row.id },
        {
          $set: _.mapKeys(row, (value, key) => (key === 'id' ? '_id' : key)),
        },
        { upsert: true }
      );
    } else {
      this.doc.insertOne(row);
    }
    callback(null, chunk);
  }

  _destroy(error, callback) {
    try {
      this.session.commitTransaction();
      this.session.endSession();
    } catch (err) {
      this.session.abortTransaction();
      callback(err);
    }
  }
}

const pipeline = promisify(pipelineWithCb);

export class PipelineBuilder {
  constructor() {
    this.pipes = [];
  }

  add(pipe) {
    this.pipes.push(pipe);
    return this;
  }

  build() {
    return pipeline(...this.pipes);
  }
}
