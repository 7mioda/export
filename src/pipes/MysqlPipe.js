import { Writable } from 'stream';
import _ from 'lodash';

class MysqlPipe extends Writable {
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
}

export default MysqlPipe;
