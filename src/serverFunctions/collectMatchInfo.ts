import { db } from '@database/db';
import { leagueMembershipMiddleware } from '@src/middleware/leagueMembershipMiddleware';
import { createServerFn } from '@tanstack/react-start';
import { zodValidator } from '@tanstack/zod-adapter';
import z from 'zod/v4';

const collectMatchInfoSchema = z.object({
    leagueId: z.string(),
    matchId: z.number(),
});

export const collectMatchInfo = createServerFn()
    .middleware([leagueMembershipMiddleware])
    .inputValidator(zodValidator(collectMatchInfoSchema))
    .handler(async ({ data }) => {
        const leagueId = data.leagueId;
        const matchId = data.matchId;

        const matchInfo = await db
            .selectFrom('match')
            .where('id', '=', matchId)
            .selectAll()
            .executeTakeFirst();
        if (!matchInfo) {
            throw new Error('Match not found');
        }

        const [member1, member2] = await Promise.all([
            db
                .selectFrom('member')
                .where('id', '=', matchInfo.member1_id)
                .where('league_id', '=', leagueId)
                .select(['id', 'name', 'glicko2_rating', 'league_id'])
                .executeTakeFirst(),
            db
                .selectFrom('member')
                .where('id', '=', matchInfo.member2_id)
                .where('league_id', '=', leagueId)
                .select(['id', 'name', 'glicko2_rating', 'league_id'])
                .executeTakeFirst(),
        ]);

        if (!member1 || !member2) {
            throw new Error('One or both members not found in the specified league');
        }

        if (member1.league_id !== leagueId || member2.league_id !== leagueId) {
            throw new Error('One or both members do not belong to the specified league');
        }

        return {
            match: matchInfo,
            member1,
            member2,
        };
    });
