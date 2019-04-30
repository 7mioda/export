import { MongoClient } from 'mongodb';
import config from '../config';

const { mongoDb: { databaseURL } } = config;

export default () => MongoClient.connect(databaseURL, { useNewUrlParser: true });
