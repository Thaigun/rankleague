import { Kysely, sql } from 'kysely';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('match')
        .addColumn('edited_at', 'timestamp')
        .addColumn('removed_at', 'timestamp')
        .execute();

    await db.schema
        .createTable('match_edit')
        .addColumn('id', 'integer', (col) => col.generatedAlwaysAsIdentity().primaryKey())
        .addColumn('match_id', 'integer', (col) => col.notNull().references('match.id').onDelete('cascade'))
        .addColumn('datetime', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
        .addColumn('previous_member1_score', 'integer', (col) => col.notNull())
        .addColumn('previous_member2_score', 'integer', (col) => col.notNull())
        .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('match_edit').execute();
    await db.schema.alterTable('match').dropColumn('edited_at').dropColumn('removed_at').execute();
}
