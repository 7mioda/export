import dotenv from 'dotenv';


dotenv.config();

export default {
  port: process.env.PORT,
  mongoDb: {
    databaseURL: process.env.MONGO_URI,
  },
  mySql: {
    databaseURL: process.env.MYSQL_URI,
  },
  logger: {
    logPath: process.env.LOG_PATH,
  },
};
