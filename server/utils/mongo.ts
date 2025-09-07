import { MongoClient, Db, Collection } from 'mongodb';

// Use a single shared client across hot reloads in dev
let _client: MongoClient | null = null;
let _db: Db | null = null;

// Support full MONGODB_URI or fallback to host/port and optional auth credentials
const MONGODB_URI_ENV = process.env.MONGODB_URI || null;
const MONGODB_HOST = process.env.DATABASE_HOST || '127.0.0.1';
const MONGODB_PORT = process.env.DATABASE_PORT || '27017';
const MONGODB_USER = process.env.DATABASE_USER || null;
const MONGODB_PASS = process.env.DATABASE_PASSWORD || null;
const AUTH_SOURCE = process.env.DATABASE_AUTH_SOURCE || process.env.MONGODB_AUTH_SOURCE || 'admin';
const MONGODB_DB = process.env.DATABASE_NAME || 'wedding';

const MONGODB_URI = (() => {
    if (MONGODB_URI_ENV) return MONGODB_URI_ENV;
    const hostPort = `${MONGODB_HOST}:${MONGODB_PORT}`;
    if (MONGODB_USER && MONGODB_PASS) {
        const encoded = encodeURIComponent(MONGODB_PASS);
        return `mongodb://${MONGODB_USER}:${encoded}@${hostPort}/?authSource=${AUTH_SOURCE}`;
    }
    return `mongodb://${hostPort}`;
})();

export interface UserDoc {
    _id?: any;
    username: string;
    passwordHash: string; // bcrypt hash
    createdAt: Date;
}

export async function getMongoClient(): Promise<MongoClient> {
    if (_client) return _client; // reuse existing client across hot reloads
    _client = new MongoClient(MONGODB_URI);
    await _client.connect();
    return _client;
}

export async function getDb(): Promise<Db> {
    if (_db) return _db;
    const client = await getMongoClient();
    _db = client.db(MONGODB_DB);
    return _db;
}

export async function usersCollection(): Promise<Collection<UserDoc>> {
    const db = await getDb();
    return db.collection<UserDoc>('users');
}
