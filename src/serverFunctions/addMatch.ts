import { leagueMembershipMiddleware } from '@src/middleware/leagueMembershipMiddleware';
import { db } from '@database/db';
import { createServerFn } from '@tanstack/react-start';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod/v4';
import { applyMatchResult } from '@src/utils/ratings/continuouslyUpdatedGlicko2';

const addMatchFnSchema = z.object({
    member1Id: z.int(),
    member2Id: z.int(),
    member1Score: z.int(),
    member2Score: z.int(),
});

export const addMatchFn = createServerFn({ method: 'POST' })
    .middleware([leagueMembershipMiddleware])
    .inputValidator(zodValidator(addMatchFnSchema))
    .handler(async ({ data }) => {
        const { member1Id, member2Id, member1Score, member2Score } = data;

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

                const now = new Date();

                const player1 = {
                    rating: member1Row.glicko2_rating,
                    ratingDeviation: member1Row.glicko2_rating_deviation,
                    volatility: member1Row.glicko2_volatility,
                    lastUpdated: member1LastMatch?.datetime ?? now,
                };

                const player2 = {
                    rating: member2Row.glicko2_rating,
                    ratingDeviation: member2Row.glicko2_rating_deviation,
                    volatility: member2Row.glicko2_volatility,
                    lastUpdated: member2LastMatch?.datetime ?? now,
                };

                const player1Score = member1Score > member2Score ? 1 : member1Score < member2Score ? 0 : 0.5;
                const player2Score = member2Score > member1Score ? 1 : member2Score < member1Score ? 0 : 0.5;

                const [updatedPlayer1, updatedPlayer2] = applyMatchResult(
                    player1,
                    player2,
                    player1Score,
                    player2Score,
                    now,
                );

                await Promise.all([
                    trx
                        .insertInto('match')
                        .values({
                            member1_id: member1Id,
                            member2_id: member2Id,
                            member1_score: member1Score,
                            member2_score: member2Score,
                        })
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
            });
    });
