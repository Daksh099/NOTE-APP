import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    // If connecting to Atlas failed and we're in a non-production environment,
    // attempt to start an in-memory MongoDB for development so the app keeps running.
    const nodeEnv = process.env.NODE_ENV || 'development';
    if (nodeEnv !== 'production') {
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memUri = mongod.getUri();

        // Replace cached.promise with a connection to the in-memory server.
        cached.promise = mongoose.connect(memUri, {
          bufferCommands: false,
          serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS) || 5000,
        }).then((mongoose) => {
          // store reference so it can be cleaned up if needed
          cached._memoryServer = mongod;
          return mongoose;
        }).catch((err) => {
          cached.promise = null;
          throw err;
        });

        cached.conn = await cached.promise;
        console.warn('Connected to in-memory MongoDB (development fallback).');
        return cached.conn;
      } catch (memErr) {
        // If memory server couldn't be started, rethrow original error for visibility.
        throw e;
      }
    }
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
