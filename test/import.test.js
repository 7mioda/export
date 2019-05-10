import stream from 'stream';
import { getReadStreamFromPath, MongoPipe } from '../src/pipes';

const isReadableStream = (obj) =>
  !!(
    obj instanceof stream.Stream &&
    typeof (obj._read === 'function') &&
    typeof (obj._readableState === 'object')
  );

test('Reader Should be reader Stream', async () => {
  const reader = getReadStreamFromPath('./data/products.csv');
  expect(isReadableStream(reader)).toBe(true);
});

test('Mongo Pipe', async () => {
  const mocData = { name: 'test', surname: 'test' };
  const mongoPipeInstance = new MongoPipe(global.exportClient, 'test', 'testDoc');
  mongoPipeInstance.write(mocData);
  const db = global.exportClient.db('test');
  const doc = db.collection('testDoc');
  const data = await doc.findOne();
  expect(data).toBeDefined();
  expect(data.name).toEqual(mocData.name);
  expect(data.surname).toEqual(mocData.surname);
  doc.deleteOne();
});
