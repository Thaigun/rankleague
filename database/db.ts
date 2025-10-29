import { Kysely, PostgresDialect } from 'kysely';
import { Database } from './tables';
import { Pool } from 'pg';

const password = process.env.POSTGRES_PASSWORD;

if (!password) {
    throw new Error('POSTGRES_PASSWORD is not set');
}

const dialect = new PostgresDialect({
    pool: new Pool({
        database: process.env.POSTGRES_DB || 'ranklig',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: 5432,
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD,
        max: 10,
    }),
});

export const db = new Kysely<Database>({
    dialect,
});
