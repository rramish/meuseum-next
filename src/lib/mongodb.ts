import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<Mongoose> {
  if (cached.conn) {
    console.log("db already connected");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "mosida_updated",
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 15000, // Timeout for server selection
      socketTimeoutMS: 45000, // How long a socket can be idle before closing
      connectTimeoutMS: 10000, // Timeout for initial connection
      waitQueueTimeoutMS: 10000 
    };
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("db connected");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
