import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import { importData } from '../services/import';
import { exportData } from '../services/export';


export default async ({ app }) => {
  app.get('/status', (request, response) => { response.status(200).end(); });
  app.head('/status', (request, response) => { response.status(200).end(); });
  app.enable('trust proxy');
  app.use(cors());
  app.use(morgan('combined'));
  app.use(bodyParser.urlencoded({ extended: true }));
  const router = express.Router();
  const importRouter = router.get('/export', (request, response) => {
    const { query: { entity_name: entityName }, app: { locals: { mongo, mySql } } } = request;
    importData(`./${entityName}.csv`, { connection: mongo, dbName: 'export', docName: entityName });
    exportData({ connection: mongo, dbName: 'export', docName: entityName }, { connection: mySql, entityName });
    response.end('Importing Data');
  });
  app.use(importRouter);
  return app;
};
