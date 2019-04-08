import fs from 'fs';

const logger = fs.createWriteStream('./logger.txt', { encoding: 'utf-8', flags: 'r+' });
logger.on('open', () => console.log('Logger s ready'));
export const log = (data) => {
  logger.write((`${JSON.stringify(data, null, 2)}\n`));
};
