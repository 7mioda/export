import stream from 'stream';
import { getReader } from '../src/services/import';

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
