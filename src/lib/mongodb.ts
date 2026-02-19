import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
      throw new Error("Please add your MongoDB URI to .env");
}

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient>;

type GlobalWithMongo = typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
};

if (process.env.NODE_ENV === "development") {
      // In development, use a global variable so the value is preserved across module reloads
      const g = globalThis as GlobalWithMongo;
      if (!g._mongoClientPromise) {
            client = new MongoClient(uri, options);
            g._mongoClientPromise = client.connect();
      }
      clientPromise = g._mongoClientPromise as Promise<MongoClient>;
} else {
      // In production, create a new client for every connection
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
}

export default clientPromise;
