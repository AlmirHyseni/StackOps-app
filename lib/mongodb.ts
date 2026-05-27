import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "stackops";

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

type GlobalMongoState = {
  clientPromise?: Promise<MongoClient>;
};

const globalMongo = globalThis as typeof globalThis & GlobalMongoState;

const clientPromise =
  globalMongo.clientPromise ??
  new MongoClient(uri, {
    appName: "stackops-app",
  }).connect();

if (!globalMongo.clientPromise) {
  globalMongo.clientPromise = clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}
