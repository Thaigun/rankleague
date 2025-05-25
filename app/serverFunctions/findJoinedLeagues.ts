import { createServerFn } from '@tanstack/react-start';
import { db } from '@src/database/db';
import { authMiddleware } from '@app/middleware/authMiddleware';
import { setCookieWithLeagues } from './serverUtils/authTokenUtils';

export const findJoinedLeaguesFn = createServerFn()
    .middleware([authMiddleware])
    .handler(async ({ context }) => {
        const leagueIds = context.auth?.leagues;
        if (!leagueIds || leagueIds.length === 0) {
            return [];
        }
        const leagues = await db
            .selectFrom('league')
            .where('id', 'in', leagueIds)
            .select(['id', 'name', 'description'])
            .execute();
        if (leagues.length !== leagueIds.length) {
            const existingLeagues = leagues.map((league) => league.id);
            setCookieWithLeagues(existingLeagues);
        }
        return leagues;
    });
