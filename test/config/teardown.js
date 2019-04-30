export default async () => {
  console.log('Teardown Mongo Connection');
  delete global.exportClient;
  delete global.exportDB;
};
