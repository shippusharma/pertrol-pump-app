import { connect, Types } from 'mongoose';
import { configs } from '../env';

const uri = configs.db.uri;

//-----------------------------------------------------------------------------------------------------------------

// connect to mongodb database
let cachedDb: null | typeof import('mongoose') = null;
export async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  const connection = await connect(uri);
  cachedDb = connection;
  return cachedDb;
}

//-----------------------------------------------------------------------------------------------------------------

export function isValidId(_id: string): boolean {
  return Types.ObjectId.isValid(_id);
}

export function convertIntoMongodbId(_id: string): Types.ObjectId {
  return new Types.ObjectId(_id);
}

export function generateNewMongodbId(): Types.ObjectId {
  return new Types.ObjectId();
}
