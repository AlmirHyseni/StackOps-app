import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "stackops";

type GlobalMongoState = {
  _mongoClientPromise?: Promise<MongoClient>;
};

const globalMongo = globalThis as typeof globalThis & GlobalMongoState;

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  // Në mjedisin e produksionit (Vercel), është më mirë të krijohet një klient i ri për çdo thirrje nëse Promise global humb
  if (process.env.NODE_ENV === "production") {
    const client = new MongoClient(uri, { appName: "stackops-app" });
    return client.connect();
  }

  // Në zhvillim (Local), përdoret memoria globale që mos të mbingarkohet databaza me lidhje të reja gjatë Fast Refresh
  if (!globalMongo._mongoClientPromise) {
    const client = new MongoClient(uri, { appName: "stackops-app" });
    globalMongo._mongoClientPromise = client.connect();
  }

  return globalMongo._mongoClientPromise;
}

export async function getDbContext(): Promise<{ db: Db; source: "mongodb" | "memory" }> {
  try {
    const client = await getClientPromise();
    return { db: client.db(dbName), source: "mongodb" };
  } catch (error) {
    console.error("Gabim gjatë lidhjes me MongoDB:", error);
    throw error;
  }
}

export async function getDb(): Promise<Db> {
  const { db } = await getDbContext();
  return db;
}