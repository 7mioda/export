import { initLogger } from '../services/logger';
import config from '../config';

const { logger: { logPath } } = config;

export default () => initLogger(logPath);
