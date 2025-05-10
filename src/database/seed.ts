import { db } from './db';
import { migrator } from './migrator';

await migrator.migrateToLatest();

await db
    .insertInto('user')
    .values({
        username: 'test1',
    })
    .execute();
