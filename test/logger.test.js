import fs from 'fs';
import { promisify } from 'util';
import { initLogger } from '../src/services/logger';

const readFileAsync = promisify(fs.readFile);
const deleteFn = promisify(fs.unlink);

test('Logger Should be reader Stream', async () => {
  const logger = await initLogger('./logger-test.txt');
  expect(logger).toBeDefined();
  logger({ test: 'test2' });
  const content = await readFileAsync('./logger-test.txt', { encoding: 'utf-8' });
  expect(JSON.parse(content)).toEqual({ test: 'test2' });
  await deleteFn('./logger-test.txt');
});
