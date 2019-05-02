export default async () => {
  console.log('Teardown Mongo / MySql Connections');
  delete global.exportClient;
  delete global.exportDB;
};
