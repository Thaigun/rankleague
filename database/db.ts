import { Kysely, PostgresDialect } from 'kysely';
import { Database } from './tables';
import { Pool } from 'pg';

const dialect = new PostgresDialect({
    pool: new Pool({
        database: 'league',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        max: 10,
    }),
});

export const db = new Kysely<Database>({
    dialect,
});
