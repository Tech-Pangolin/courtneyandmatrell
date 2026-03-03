import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: typeof mongoose | null | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // During build we don't want to throw, but connecting will fail until this is set.
  console.warn("[MongoDB] MONGODB_URI is not set. Database operations will fail.");
}

export async function connectMongo() {
  if (!MONGODB_URI) return null;

  if (global._mongooseConn) {
    return global._mongooseConn;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || undefined,
    });
    global._mongooseConn = conn;
    return conn;
  } catch (err) {
    console.error("[MongoDB] Connection error", err);
    throw err;
  }
}

