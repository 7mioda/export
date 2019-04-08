import fs from 'fs';


let logger;
fs.stat('./logger.txt', (error, stats) => {
  if (error) {
    fs.appendFileSync('./logger.txt', '');
  }
  logger = fs.createWriteStream('./logger.txt', { encoding: 'utf-8', flags: 'r+' });
  logger.on('open', () => console.log('Logger s ready'));
  return stats;
});

export const log = (data) => {
  logger.write((`${JSON.stringify(data, null, 2)}\n`));
};
