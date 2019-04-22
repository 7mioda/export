import chalk from 'chalk';
import express from 'express';
import config from './config';
import { init } from './loaders';

async function startServer() {
  const app = express();
  await init({ expressApp: app });
  const { port } = config;
  app.listen(port || 7000, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(chalk.whiteBright.bgBlue(`      Go Go Server on ${port} !      `));
  });
}

startServer();
