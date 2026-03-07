import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Configuration - prefer full URI, fallback to host/port and optional auth
const MONGODB_URI = process.env.MONGODB_URI || null;
const MONGODB_HOST = process.env.DATABASE_HOST || '127.0.0.1';
const MONGODB_PORT = process.env.DATABASE_PORT || '27017';
const MONGODB_DB = process.env.DATABASE_NAME || 'wedding';
// Accept multiple possible env names for credentials
const MONGODB_USER = process.env.DATABASE_USER || null;
const MONGODB_PASSWORD = process.env.DATABASE_PASSWORD || null;
const AUTH_SOURCE = process.env.DATABASE_AUTH_SOURCE || 'admin';

function buildUri() {
    if (MONGODB_URI) return MONGODB_URI;
    const hostPort = `${MONGODB_HOST}:${MONGODB_PORT}`;
    if (MONGODB_USER && MONGODB_PASSWORD) {
        // encode password in case it has special chars
        const encoded = encodeURIComponent(MONGODB_PASSWORD);
        return `mongodb://${MONGODB_USER}:${encoded}@${hostPort}/?authSource=${AUTH_SOURCE}`;
    }
    return `mongodb://${hostPort}`;
}

const CONNECTION_URI = buildUri();

async function main() {
    const client = new MongoClient(CONNECTION_URI);
    try {
        await client.connect();
    } catch (err) {
        console.error('Failed to connect to MongoDB with the following connection info:');
        console.error(`  host: ${MONGODB_HOST}:${MONGODB_PORT}`);
        if (MONGODB_USER) console.error(`  user: ${MONGODB_USER}`);
        console.error('  (You can provide a full MONGODB_URI or DATABASE_USER/DATABASE_PASSWORD env vars)');
        throw err;
    }
    try {
        const db = client.db(MONGODB_DB);
        const users = db.collection('users');

        const username = 'felixrizzolli';
        const plain = 'felix2000';

        // Hash the password with bcrypt
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(plain, saltRounds);

        // Upsert the test user
        const now = new Date();
        const res = await users.updateOne(
            { username },
            {
                $set: {
                    username,
                    passwordHash,
                    createdAt: now,
                },
            },
            { upsert: true },
        );

        console.log('Upsert result:', res.upsertedId ? `created id=${res.upsertedId}` : 'updated existing');
        console.log('Test user ready:', username);
        // Create / upsert images collection entries
        const images = db.collection('images');
        const fotoboxTotal = 245;
        for (let i = 1; i <= fotoboxTotal; i++) {
            const name = `HOCHZEIT-FOTOBOX-${i}`;
            const hash = crypto.createHash('sha256').update(name).digest('hex');
            const filename = `${hash}.jpg`;

            await images.updateOne(
                { filename },
                {
                    $set: {
                        name,
                        filename,
                        categories: ['fotobox'],
                        createdAt: now,
                    },
                },
                { upsert: true },
            );
        }

        const photographerTotal = 996;
        for (let i = 1; i <= photographerTotal; i++) {
            const name = `HOCHZEIT-PHOTOGRAPHER-${i}`;
            const hash = crypto.createHash('sha256').update(name).digest('hex');
            const filename = `${hash}.jpg`;

            await images.updateOne(
                { filename },
                {
                    $set: {
                        name,
                        filename,
                        categories: ['photographer'],
                        createdAt: now,
                    },
                },
                { upsert: true },
            );
        }
    } finally {
        await client.close();
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
