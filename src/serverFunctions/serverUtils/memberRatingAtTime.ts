import { Database } from '@database/tables';
import { Kysely, Transaction } from 'kysely';

export async function memberRatingAtTime(
    db: Kysely<Database> | Transaction<Database>,
    memberId: number,
    timestamp: Date,
) {
    const memberRatingBefore = await db
        .selectFrom('rating_history')
        .innerJoin('match', 'match.id', 'rating_history.after_match_id')
        .where('member_id', '=', memberId)
        .where('match.datetime', '<', timestamp)
        .orderBy('match.datetime', 'desc')
        .limit(1)
        .select(['glicko2_rating', 'glicko2_rating_deviation', 'glicko2_volatility'])
        .executeTakeFirst();

    if (!memberRatingBefore) {
        return {
            glicko2_rating: 1500,
            glicko2_rating_deviation: 350,
            glicko2_volatility: 0.06,
        };
    }

    memberRatingBefore;
}
