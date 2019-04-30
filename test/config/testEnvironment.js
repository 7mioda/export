const { MongoClient } = require('mongodb');
const mysql = require('mysql');
const NodeEnvironment = require('jest-environment-node');

module.exports = class MongoEnvironment extends NodeEnvironment {
  async setup() {
    if (!this.global.exportClient) {
      this.global.exportClient = await MongoClient.connect(
        process.env.MONGO_URI,
        {
          useNewUrlParser: true,
          poolSize: 50,
          wtimeout: 2500,
        }
      );
      this.global.importClient = mysql.createConnection(process.env.MYSQL_URI);
      await super.setup();
    }
  }

  async teardown() {
    await this.global.exportClient.close();
    await this.global.importClient.destroy();
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
};
