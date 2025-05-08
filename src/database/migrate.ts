import { MigrationResultSet, Migrator } from 'kysely';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { db } from './db';

class BunMigrationProvider {
    constructor(private migrationsPath: string) {}

    async getMigrations() {
        const migrations: Record<string, any> = {};
        const files = await readdir(this.migrationsPath);

        for (const file of files) {
            if (!file.endsWith('.ts')) continue;

            const name = path.parse(file).name;
            const module = await import(path.join(process.cwd(), this.migrationsPath, file));
            migrations[name] = module.default;
        }

        return migrations;
    }
}

const migrator = new Migrator({
    db: db,
    provider: new BunMigrationProvider('./migrations'),
});

const args = Bun.argv;

if (args.length !== 3) {
    console.error('Unexpected number of arguments.');
    process.exit(1);
}

const command = args[2];

switch (command) {
    case 'up': {
        const result = await migrator.migrateUp();
        printMigrationResult(result);
        break;
    }
    case 'latest': {
        const result = await migrator.migrateToLatest();
        printMigrationResult(result);
        break;
    }
    case 'down': {
        const result = await migrator.migrateDown();
        printMigrationResult(result);
        break;
    }
    case 'list': {
        const migrations = await migrator.getMigrations();
        console.log('Available migrations:', migrations);
        break;
    }
}

function printMigrationResult(result: MigrationResultSet) {
    console.log('Migration result:', result);
}
