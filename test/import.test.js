import stream from 'stream';
import { getReader, mongoPipe } from '../src/services/import';

const isReadableStream = (obj) =>
  !!(
    obj instanceof stream.Stream &&
    typeof (obj._read === 'function') &&
    typeof (obj._readableState === 'object')
  );

test('Reader Should be reader Stream', async () => {
  const reader = getReader('./data/products.csv');
  expect(isReadableStream(reader)).toBe(true);
});

test('Mongo Pipe', async () => {
  const mocData = { name: 'test', surname: 'test' };
  const mongoPipeInstance = mongoPipe(global.exportClient, 'test', 'testDoc');
  mongoPipeInstance.write(mocData);
  const db = global.exportClient.db('test');
  const doc = db.collection('testDoc');
  const data = await doc.findOne();
  expect(data).toBeDefined();
  expect(data.name).toEqual(mocData.name);
  expect(data.surname).toEqual(mocData.surname);
  doc.deleteOne();
});
