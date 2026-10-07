import dns from "node:dns";
import mongoose from "mongoose";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
function getMongoDBUri(): string {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error("MONGODB_URI is not defined.")
    }

    return uri;
}

type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseCache | undefined;
}

const cached = global.mongoose ?? {
    conn: null,
    promise: null,
};

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if(!cached.promise) {
        cached.promise = mongoose.connect(getMongoDBUri());
    }

    cached.conn = await cached.promise;
    global.mongoose = cached;

    return cached.conn;
}