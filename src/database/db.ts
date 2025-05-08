import { sql } from 'bun';
import {
    CompiledQuery,
    DatabaseConnection,
    DatabaseIntrospector,
    Dialect,
    Driver,
    Kysely,
    PostgresAdapter,
    PostgresIntrospector,
    PostgresQueryCompiler,
    QueryCompiler,
    TransactionSettings,
} from 'kysely';
import { Database } from './tables';

class BunDatabaseConnection implements DatabaseConnection {
    async executeQuery<T>(compiledQuery: CompiledQuery): Promise<{ rows: T[] }> {
        const result = await sql`${compiledQuery.sql}`;
        return { rows: result };
    }

    async *streamQuery<R>(_: CompiledQuery, __: undefined): AsyncIterableIterator<{ rows: R[] }> {
        throw new Error('Streaming not supported with Bun SQL client.');
    }
}

class BunTransactionConnection extends BunDatabaseConnection {
    private transactionId: number;

    constructor(transactionId: number) {
        super();
        this.transactionId = transactionId;
    }

    async executeQuery<T>(compiledQuery: CompiledQuery): Promise<{ rows: T[] }> {
        // Prefix all queries with the transaction ID to keep track
        const result = await sql`${compiledQuery.sql}`;
        return { rows: result };
    }
}

class BunDriver implements Driver {
    private transactionCounter = 0; // Keeps track of unique transactions

    async init(): Promise<void> {}

    async acquireConnection(): Promise<DatabaseConnection> {
        return new BunDatabaseConnection();
    }

    async beginTransaction(conn: DatabaseConnection, settings: TransactionSettings): Promise<void> {
        const transaction = conn as BunDatabaseConnection;
        await transaction.executeQuery({ sql: 'BEGIN', parameters: [], query: {} as any });
    }

    async commitTransaction(conn: DatabaseConnection): Promise<void> {
        const transaction = conn as BunDatabaseConnection;
        await transaction.executeQuery({ sql: 'COMMIT', parameters: [], query: {} as any });
    }

    async rollbackTransaction(conn: DatabaseConnection): Promise<void> {
        const transaction = conn as BunDatabaseConnection;
        await transaction.executeQuery({ sql: 'ROLLBACK', parameters: [], query: {} as any });
    }

    async releaseConnection(_: DatabaseConnection): Promise<void> {}

    async destroy(): Promise<void> {}

    async acquireTransactionConnection(): Promise<DatabaseConnection> {
        return new BunTransactionConnection(++this.transactionCounter);
    }

    async releaseTransactionConnection(_: DatabaseConnection): Promise<void> {}
}

export class BunPostgresDialect implements Dialect {
    createAdapter() {
        return new PostgresAdapter();
    }

    createDriver(): Driver {
        return new BunDriver();
    }

    createQueryCompiler(): QueryCompiler {
        return new PostgresQueryCompiler();
    }

    createIntrospector(db: Kysely<any>): DatabaseIntrospector {
        return new PostgresIntrospector(db);
    }
}

export const db = new Kysely<Database>({
    dialect: new BunPostgresDialect(),
});
