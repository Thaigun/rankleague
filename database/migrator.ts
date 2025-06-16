import { Migration, Migrator } from 'kysely';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { db } from './db';

class BunMigrationProvider {
    constructor(private migrationsPath: string) {}

    async getMigrations() {
        const migrations: Record<string, Migration> = {};
        const files = await readdir(path.resolve(import.meta.dir, this.migrationsPath));

        for (const file of files) {
            if (!file.endsWith('.ts')) continue;

            const name = path.parse(file).name;
            const fullPath = path.resolve(import.meta.dir, this.migrationsPath, file);
            const migrationModule: unknown = await import(fullPath);
            if (!isMigration(migrationModule)) {
                throw new Error(`Migration module ${name} does not have valid up/down functions.`);
            }
            migrations[name] = migrationModule;
        }

        return migrations;
    }
}

export const migrator = new Migrator({
    db: db,
    provider: new BunMigrationProvider('./migrations'),
});

function isMigration(module: unknown): module is Migration {
    if (typeof module !== 'object' || module === null) {
        return false;
    }
    if (!('up' in module) || typeof module.up !== 'function') {
        return false;
    }
    return true;
}
