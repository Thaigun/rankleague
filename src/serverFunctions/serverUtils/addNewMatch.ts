import { db } from '@database/db';
import { applyMatchResult } from '@src/utils/ratings/continuouslyUpdatedGlicko2';

export async function addNewMatch(matchData: {
    member1Id: number;
    member2Id: number;
    member1Score: number;
    member2Score: number;
}) {
    const { member1Id, member2Id, member1Score, member2Score } = matchData;
    await db
        .transaction()
        .setIsolationLevel('serializable')
        .execute(async (trx) => {
            const [member1Row, member2Row, member1LastMatch, member2LastMatch] = await Promise.all([
                trx
                    .selectFrom('member')
                    .select(['glicko2_rating', 'glicko2_rating_deviation', 'glicko2_volatility'])
                    .where('id', '=', member1Id)
                    .executeTakeFirstOrThrow(),
                trx
                    .selectFrom('member')
                    .select(['glicko2_rating', 'glicko2_rating_deviation', 'glicko2_volatility'])
                    .where('id', '=', member2Id)
                    .executeTakeFirstOrThrow(),
                trx
                    .selectFrom('match')
                    .select('datetime')
                    .orderBy('datetime', 'desc')
                    .where((expressionBuilder) =>
                        expressionBuilder('member1_id', '=', member1Id).or('member2_id', '=', member1Id),
                    )
                    .executeTakeFirst(),
                trx
                    .selectFrom('match')
                    .select('datetime')
                    .orderBy('datetime', 'desc')
                    .where((expressionBuilder) =>
                        expressionBuilder('member1_id', '=', member2Id).or('member2_id', '=', member2Id),
                    )
                    .executeTakeFirst(),
            ]);

            const matchTime = new Date();

            const player1 = {
                rating: member1Row.glicko2_rating,
                ratingDeviation: member1Row.glicko2_rating_deviation,
                volatility: member1Row.glicko2_volatility,
                lastUpdated: member1LastMatch?.datetime ?? matchTime,
            };

            const player2 = {
                rating: member2Row.glicko2_rating,
                ratingDeviation: member2Row.glicko2_rating_deviation,
                volatility: member2Row.glicko2_volatility,
                lastUpdated: member2LastMatch?.datetime ?? matchTime,
            };

            const player1Score = member1Score > member2Score ? 1 : member1Score < member2Score ? 0 : 0.5;
            const player2Score = member2Score > member1Score ? 1 : member2Score < member1Score ? 0 : 0.5;

            const [updatedPlayer1, updatedPlayer2] = applyMatchResult(
                player1,
                player2,
                player1Score,
                player2Score,
                matchTime,
            );

            const [matchInsertResult] = await Promise.all([
                trx
                    .insertInto('match')
                    .values({
                        member1_id: member1Id,
                        member2_id: member2Id,
                        member1_score: member1Score,
                        member2_score: member2Score,
                    })
                    .returning('id')
                    .execute(),
                trx
                    .updateTable('member')
                    .set({
                        glicko2_rating: updatedPlayer1.rating,
                        glicko2_rating_deviation: updatedPlayer1.ratingDeviation,
                        glicko2_volatility: updatedPlayer1.volatility,
                    })
                    .where('id', '=', member1Id)
                    .execute(),
                trx
                    .updateTable('member')
                    .set({
                        glicko2_rating: updatedPlayer2.rating,
                        glicko2_rating_deviation: updatedPlayer2.ratingDeviation,
                        glicko2_volatility: updatedPlayer2.volatility,
                    })
                    .where('id', '=', member2Id)
                    .execute(),
            ]);
            const matchId = matchInsertResult.at(0)?.id;
            if (matchId === undefined) {
                throw new Error('Failed to insert match, insert returned undefined id');
            }
            await trx
                .insertInto('rating_history')
                .values([
                    {
                        member_id: member1Id,
                        glicko2_rating: updatedPlayer1.rating,
                        glicko2_rating_deviation: updatedPlayer1.ratingDeviation,
                        glicko2_volatility: updatedPlayer1.volatility,
                        after_match_id: matchId,
                    },
                    {
                        member_id: member2Id,
                        glicko2_rating: updatedPlayer2.rating,
                        glicko2_rating_deviation: updatedPlayer2.ratingDeviation,
                        glicko2_volatility: updatedPlayer2.volatility,
                        after_match_id: matchId,
                    },
                ])
                .execute();
        });
}
