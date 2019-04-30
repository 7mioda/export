const { MongoClient } = require('mongodb');
const NodeEnvironment = require('jest-environment-node');

module.exports = class MongoEnvironment extends NodeEnvironment {
  async setup() {
    if (!this.global.exportClient) {
      this.global.exportClient = await MongoClient.connect(
        process.env.MONGO_URI,
        { useNewUrlParser: true, poolSize: 50, wtimeout: 2500 }
      );
      await super.setup();
    }
  }

  async teardown() {
    await this.global.exportClient.close();
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
};
