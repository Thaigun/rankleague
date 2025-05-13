import { Migrator } from 'kysely';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { db } from './db';

class BunMigrationProvider {
    constructor(private migrationsPath: string) {}

    async getMigrations() {
        const migrations: Record<string, any> = {};
        console.log(import.meta.dir);
        const files = await readdir(path.resolve(import.meta.dir, this.migrationsPath));

        for (const file of files) {
            if (!file.endsWith('.ts')) continue;

            const name = path.parse(file).name;
            const fullPath = path.resolve(import.meta.dir, this.migrationsPath, file);
            const { up, down } = await import(fullPath);

            migrations[name] = {
                up,
                down,
            };
        }

        return migrations;
    }
}

export const migrator = new Migrator({
    db: db,
    provider: new BunMigrationProvider('./migrations'),
});
