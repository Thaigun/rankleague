import { MigrationResultSet } from 'kysely';
import { migrator } from './migrator';

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

process.exit(0);

function printMigrationResult(result: MigrationResultSet) {
    console.log('Migration result:', result);
}
