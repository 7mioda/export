import fs from 'fs';

/**
 *
 * @param path String
 * @param option
 * @returns file stream {ReadStream}
 */
export const getReadStreamFromPath = (path, option = { encoding: 'utf-8' }) => {
  try {
    fs.statSync(path);
    return fs.createReadStream(path, option);
  } catch (error) {
    throw error;
  }
};
