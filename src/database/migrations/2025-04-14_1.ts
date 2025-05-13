import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('member')
        .addColumn('id', 'integer', (col) => col.generatedAlwaysAsIdentity().primaryKey())
        .addColumn('name', 'varchar', (col) => col.notNull())
        .addColumn('joined_at', 'timestamp', (col) => col.notNull())
        .addColumn('league_id', 'varchar', (col) => col.notNull().references('league.id').onDelete('cascade'))
        .addColumn('is_admin', 'boolean', (col) => col.notNull().defaultTo(false))
        .execute();

    await db.schema
        .createTable('league')
        .addColumn('id', 'varchar', (col) => col.notNull().primaryKey())
        .addColumn('name', 'varchar', (col) => col.notNull())
        .addColumn('description', 'varchar')
        .addColumn('hashed_password', 'varchar', (col) => col.notNull())
        .addColumn('salt', 'varchar', (col) => col.notNull())
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .execute();

    await db.schema
        .createTable('match')
        .addColumn('id', 'integer', (col) => col.generatedAlwaysAsIdentity().primaryKey())
        .addColumn('member1_id', 'integer', (col) =>
            col.notNull().references('member.id').onDelete('cascade'),
        )
        .addColumn('member2_id', 'integer', (col) =>
            col.notNull().references('member.id').onDelete('cascade'),
        )
        .addColumn('member1_score', 'integer', (col) => col.notNull())
        .addColumn('member2_score', 'integer', (col) => col.notNull())
        .addColumn('datetime', 'timestamp', (col) => col.notNull())
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('match').execute();
    await db.schema.dropTable('member').execute();
    await db.schema.dropTable('league').execute();
}
