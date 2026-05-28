import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "stackops";

type GlobalMongoState = {
  clientPromise?: Promise<MongoClient>;
};

const globalMongo = globalThis as typeof globalThis & GlobalMongoState;

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  if (!globalMongo.clientPromise) {
    globalMongo.clientPromise = new MongoClient(uri, {
      appName: "stackops-app",
    }).connect();
  }

  return globalMongo.clientPromise;
}

export async function getDbContext(): Promise<{ db: Db; source: "mongodb" | "memory" }> {
  const client = await getClientPromise();
  return { db: client.db(dbName), source: "mongodb" };
}

export async function getDb(): Promise<Db> {
  const { db } = await getDbContext();
  return db;
}
