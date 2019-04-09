import chalk from 'chalk';
import _ from 'lodash';
import { insertOne } from './database';

export const importData = (connection, entityName , source) => {
  const dataStream = source.find().stream();
  console.time(chalk.hex('#fff').bgBlue('Importing Data'));
  dataStream.on('readable', async () => {
    let row = dataStream.read();
    while (row) {
      insertOne(connection, entityName, _.mapKeys(row, (value, key) => ((key === '_id') ? 'id' : key)));
      row = dataStream.read();
    }
  });
  dataStream.on('end', () => console.timeEnd(chalk.hex('#fff').bgBlue('Importing Data')));
};
