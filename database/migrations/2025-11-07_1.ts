import { applyMatchResult } from '@src/utils/ratings/continuouslyUpdatedGlicko2';
import { Kysely } from 'kysely';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('rating_history')
        .addColumn('id', 'integer', (col) => col.generatedAlwaysAsIdentity().primaryKey())
        .addColumn('member_id', 'integer', (col) => col.notNull().references('member.id').onDelete('cascade'))
        .addColumn('glicko2_rating', 'double precision', (col) => col.notNull())
        .addColumn('glicko2_rating_deviation', 'double precision', (col) => col.notNull())
        .addColumn('glicko2_volatility', 'double precision', (col) => col.notNull())
        .addColumn('after_match_id', 'integer', (col) =>
            col.notNull().references('match.id').onDelete('cascade'),
        )
        .execute();

    const members = await db.selectFrom('member').select('id').execute();
    const memberRatings = members.reduce<
        Map<
            number,
            {
                glicko2_rating: number;
                glicko2_rating_deviation: number;
                glicko2_volatility: number;
                lastPlayed: Date | null;
            }
        >
    >((acc, member) => {
        acc.set(member.id, {
            glicko2_rating: 1500,
            glicko2_rating_deviation: 350,
            glicko2_volatility: 0.06,
            lastPlayed: null,
        });
        return acc;
    }, new Map());
    const matches = await db.selectFrom('match').selectAll().orderBy('datetime', 'asc').execute();

    for (const match of matches) {
        const member1RatingsRaw = memberRatings.get(match.member1_id);
        const member2RatingsRaw = memberRatings.get(match.member2_id);
        if (!member1RatingsRaw || !member2RatingsRaw) {
            throw new Error('Member ratings not found for match', { cause: match.id });
        }
        const member1Ratings = {
            rating: member1RatingsRaw.glicko2_rating,
            ratingDeviation: member1RatingsRaw.glicko2_rating_deviation,
            volatility: member1RatingsRaw.glicko2_volatility,
            lastUpdated: member1RatingsRaw.lastPlayed ?? match.datetime,
        };
        const member2Ratings = {
            rating: member2RatingsRaw.glicko2_rating,
            ratingDeviation: member2RatingsRaw.glicko2_rating_deviation,
            volatility: member2RatingsRaw.glicko2_volatility,
            lastUpdated: member2RatingsRaw.lastPlayed ?? match.datetime,
        };
        const member1PerspectiveScore =
            match.member1_score > match.member2_score
                ? 1
                : match.member1_score < match.member2_score
                  ? 0
                  : 0.5;
        const member2PerspectiveScore =
            match.member2_score > match.member1_score
                ? 1
                : match.member2_score < match.member1_score
                  ? 0
                  : 0.5;
        const [player1NewRating, player2NewRating] = applyMatchResult(
            member1Ratings,
            member2Ratings,
            member1PerspectiveScore,
            member2PerspectiveScore,
            match.datetime,
        );
        await db
            .insertInto('rating_history')
            .values([
                {
                    member_id: match.member1_id,
                    glicko2_rating: player1NewRating.rating,
                    glicko2_rating_deviation: player1NewRating.ratingDeviation,
                    glicko2_volatility: player1NewRating.volatility,
                    after_match_id: match.id,
                },
                {
                    member_id: match.member2_id,
                    glicko2_rating: player2NewRating.rating,
                    glicko2_rating_deviation: player2NewRating.ratingDeviation,
                    glicko2_volatility: player2NewRating.volatility,
                    after_match_id: match.id,
                },
            ])
            .execute();
        memberRatings.set(match.member1_id, {
            glicko2_rating: player1NewRating.rating,
            glicko2_rating_deviation: player1NewRating.ratingDeviation,
            glicko2_volatility: player1NewRating.volatility,
            lastPlayed: match.datetime,
        });
        memberRatings.set(match.member2_id, {
            glicko2_rating: player2NewRating.rating,
            glicko2_rating_deviation: player2NewRating.ratingDeviation,
            glicko2_volatility: player2NewRating.volatility,
            lastPlayed: match.datetime,
        });
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('rating_history').execute();
}
