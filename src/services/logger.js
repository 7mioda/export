import fs from 'fs';

export const initLogger = path => new Promise((resolve, reject) => {
  const LOGGER_PATH = path || './logger.txt';
  fs.stat(LOGGER_PATH, (err) => {
    if (err) {
      fs.appendFileSync(LOGGER_PATH, '');
    }
    try {
      const loggerService = fs.createWriteStream(LOGGER_PATH, { encoding: 'utf-8', flags: 'r+' });
      const logger = (data) => {
        loggerService.write((`${JSON.stringify(data, null, 2)}\n`));
      };
      resolve(logger);
    } catch (error) {
      reject(error);
    }
  });
});
