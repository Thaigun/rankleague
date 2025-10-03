import { db } from './db';
import { migrator } from './migrator';

const migrationResult = await migrator.migrateToLatest();
console.log('Migration result:', migrationResult);

const existingLeagues = await db.selectFrom('league').select('id').execute();
if (!existingLeagues.find((league) => league.id === 'test1')) {
    const insertResult = await db
        .insertInto('league')
        .values({
            id: 'test1',
            name: 'Test League 1',
            description: 'This is a test league for development purposes.',
            hashed_password: await Bun.password.hash('test1'),
        })
        .execute();
    console.log('Inserted test league:', insertResult);
}

const existingMembers = await db.selectFrom('member').where('league_id', '=', 'test1').select('id').execute();
if (existingMembers.length === 0) {
    const insertResult = await db
        .insertInto('member')
        .values([
            {
                league_id: 'test1',
                name: 'Alice',
            },
            {
                league_id: 'test1',
                name: 'Bob',
            },
        ])
        .execute();
    console.log('Inserted test members:', insertResult);
}
