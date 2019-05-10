import { Writable } from 'stream';
import _ from 'lodash';

class MongoPipe extends Writable {
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

export default MongoPipe;
