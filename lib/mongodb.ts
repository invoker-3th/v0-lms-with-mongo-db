// MongoDB connection utilities
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || "learnhub"

if (!uri) {
  throw new Error("MONGODB_URI is not set")
}

type GlobalMongo = typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
}

const globalWithMongo = global as GlobalMongo

let clientPromise: Promise<MongoClient>

if (!globalWithMongo._mongoClientPromise) {
  const client = new MongoClient(uri)
  globalWithMongo._mongoClientPromise = client.connect()
}

clientPromise = globalWithMongo._mongoClientPromise

export async function getDatabase() {
  const client = await clientPromise
  return client.db(dbName)
}

export async function getCollection<T>(name: string) {
  const db = await getDatabase()
  return db.collection<T>(name)
}
