import { db } from '@database/db';
import { leagueMembershipMiddleware } from '@src/middleware/leagueMembershipMiddleware';
import { createServerFn } from '@tanstack/react-start';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod/v4';
import { memberRatingAtTime } from './serverUtils/memberRatingAtTime';

const editMatchScoreSchema = z.object({
    matchId: z.int(),
    member1Score: z.int(),
    member2Score: z.int(),
});

export const editMatchScoreFn = createServerFn({ method: 'POST' })
    .middleware([leagueMembershipMiddleware])
    .inputValidator(zodValidator(editMatchScoreSchema))
    .handler(async ({ data }) => {
        await db
            .transaction()
            .setIsolationLevel('serializable')
            .execute(async (trx) => {
                const oldMatchData = await trx
                    .selectFrom('match')
                    .where('id', '=', data.matchId)
                    .select(['member1_id', 'member2_id', 'member1_score', 'member2_score', 'datetime'])
                    .executeTakeFirstOrThrow();
                const members = await trx
                    .selectFrom('member')
                    .where('id', 'in', [oldMatchData.member1_id, oldMatchData.member2_id])
                    .where('league_id', '=', data.leagueId)
                    .select(['id'])
                    .execute();

                if (members.length !== 2) {
                    throw new Error('One or both members do not belong to the league');
                }
                const oldMatchWinner =
                    oldMatchData.member1_score > oldMatchData.member2_score
                        ? oldMatchData.member1_id
                        : oldMatchData.member2_id;
                const newMatchWinner =
                    data.member1Score > data.member2Score ? oldMatchData.member1_id : oldMatchData.member2_id;

                if (oldMatchWinner !== newMatchWinner) {
                    const member1RatingBefore = await memberRatingAtTime(
                        trx,
                        oldMatchData.member1_id,
                        oldMatchData.datetime,
                    );
                    const member2RatingBefore = await memberRatingAtTime(
                        trx,
                        oldMatchData.member2_id,
                        oldMatchData.datetime,
                    );
                }

                await Promise.all([
                    trx
                        .updateTable('match')
                        .set({
                            member1_score: data.member1Score,
                            member2_score: data.member2Score,
                            edited_at: new Date(),
                        })
                        .where('id', '=', data.matchId)
                        .execute(),

                    trx
                        .insertInto('match_edit')
                        .values({
                            match_id: data.matchId,
                            previous_member1_score: oldMatchData.member1_score,
                            previous_member2_score: oldMatchData.member2_score,
                        })
                        .execute(),
                ]);
            });
    });
