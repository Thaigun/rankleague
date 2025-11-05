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

const members = await db
    .selectFrom('member')
    .where('league_id', '=', 'test1')
    .select(['id', 'name'])
    .execute();
const existingMatches = await db.selectFrom('match').selectAll().execute();
if (existingMatches.length === 0) {
    const memberMap = Object.fromEntries(members.map((m) => [m.name, m.id]));

    const insertResult = await db
        .insertInto('match')
        .values([
            { member1_id: memberMap.Alice, member2_id: memberMap.Bob, member1_score: 3, member2_score: 1 },
            { member1_id: memberMap.Alice, member2_id: memberMap.Bob, member1_score: 2, member2_score: 3 },
            {
                member1_id: memberMap.Alice,
                member2_id: memberMap.Charlie,
                member1_score: 3,
                member2_score: 0,
            },
            { member1_id: memberMap.Bob, member2_id: memberMap.Charlie, member1_score: 1, member2_score: 3 },
            { member1_id: memberMap.Bob, member2_id: memberMap.Charlie, member1_score: 3, member2_score: 2 },
            { member1_id: memberMap.Diana, member2_id: memberMap.Eve, member1_score: 3, member2_score: 1 },
            { member1_id: memberMap.Diana, member2_id: memberMap.Eve, member1_score: 2, member2_score: 3 },
            { member1_id: memberMap.Diana, member2_id: memberMap.Eve, member1_score: 3, member2_score: 2 },
            { member1_id: memberMap.Frank, member2_id: memberMap.Alice, member1_score: 1, member2_score: 3 },
            { member1_id: memberMap.Frank, member2_id: memberMap.Bob, member1_score: 3, member2_score: 0 },
            {
                member1_id: memberMap.Charlie,
                member2_id: memberMap.Diana,
                member1_score: 2,
                member2_score: 3,
            },
            { member1_id: memberMap.Eve, member2_id: memberMap.Frank, member1_score: 3, member2_score: 1 },
        ])
        .execute();
    console.log('Inserted test matches:', insertResult);
}
