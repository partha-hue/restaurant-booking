"use client";

import clientPromise from "@/lib/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
      try {
            await client.connect();
            const db = client.db(); // Use default DB or specify one
            const collections = await db.listCollections().toArray();
            res.status(200).json({ message: "Connected to MongoDB!", collections });
      } catch (error) {
            res.status(500).json({ error: error.message });
      } finally {
            await client.close();
      }
}
