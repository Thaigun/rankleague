import { migrator } from './migrator';

const migrationResult = await migrator.migrateToLatest();
console.log('Migration result:', migrationResult);
