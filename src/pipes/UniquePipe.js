import { Transform } from 'stream';
import _ from 'lodash';

class UniquePipe extends Transform {
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

export default UniquePipe;
