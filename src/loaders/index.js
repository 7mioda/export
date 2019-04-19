import chalk from 'chalk';
import mySqlLoader from './mySql';
import mongoLoader from './mongoo';
import expressLoader from './express';
import loggerLoader from './logger';

export const init = async ({ expressApp }) => {
  try {
    const mongoConnection = await mongoLoader();
    console.log(chalk.whiteBright.bgBlue('      MongoDB Initialized     '));
    const mySqlConnection = mySqlLoader();
    console.log(chalk.whiteBright.bgBlue('      MySQL Initialized       '));
    const logger = await loggerLoader();
    console.log(chalk.whiteBright.bgBlue('      Logger Initialized       '));
    expressApp.locals.mongo = mongoConnection;
    expressApp.locals.mySql = mySqlConnection;
    expressApp.locals.logger = logger;
    await expressLoader({ app: expressApp });
    console.log(chalk.whiteBright.bgBlue('      Express Initialized     '));
  } catch (error) {
    console.log(error);
  }

  // ... more loaders can be here

  // ... Initialize agenda
  // ... or Redis, or whatever you want
};
