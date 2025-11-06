import { db } from './db';
import { migrator } from './migrator';
import { addNewMatch } from '@src/serverFunctions/serverUtils/addNewMatch';

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
            {
                league_id: 'test1',
                name: 'Charlie',
            },
            {
                league_id: 'test1',
                name: 'Diana',
            },
            {
                league_id: 'test1',
                name: 'Eve',
            },
            {
                league_id: 'test1',
                name: 'Frank',
            },
        ])
        .execute();
    console.log('Inserted test members:', insertResult);
}

const existingMatches = await db.selectFrom('match').selectAll().execute();
if (existingMatches.length === 0) {
    const members = await db
        .selectFrom('member')
        .where('league_id', '=', 'test1')
        .select(['id', 'name'])
        .execute();
    const memberMap = Object.fromEntries(members.map((m) => [m.name, m.id]));

    const matches = [
        { member1Id: memberMap.Alice, member2Id: memberMap.Bob, member1Score: 3, member2Score: 1 },
        { member1Id: memberMap.Alice, member2Id: memberMap.Bob, member1Score: 2, member2Score: 3 },
        {
            member1Id: memberMap.Alice,
            member2Id: memberMap.Charlie,
            member1Score: 3,
            member2Score: 0,
        },
        { member1Id: memberMap.Bob, member2Id: memberMap.Charlie, member1Score: 1, member2Score: 3 },
        { member1Id: memberMap.Bob, member2Id: memberMap.Charlie, member1Score: 3, member2Score: 2 },
        { member1Id: memberMap.Diana, member2Id: memberMap.Eve, member1Score: 3, member2Score: 1 },
        { member1Id: memberMap.Diana, member2Id: memberMap.Eve, member1Score: 2, member2Score: 3 },
        { member1Id: memberMap.Diana, member2Id: memberMap.Eve, member1Score: 3, member2Score: 2 },
        { member1Id: memberMap.Frank, member2Id: memberMap.Alice, member1Score: 1, member2Score: 3 },
        { member1Id: memberMap.Frank, member2Id: memberMap.Bob, member1Score: 3, member2Score: 0 },
        {
            member1Id: memberMap.Charlie,
            member2Id: memberMap.Diana,
            member1Score: 2,
            member2Score: 3,
        },
        { member1Id: memberMap.Eve, member2Id: memberMap.Frank, member1Score: 3, member2Score: 1 },
    ];

    for (const match of matches) {
        await addNewMatch(match);
    }
    console.log('Inserted test matches with ratings');
}
