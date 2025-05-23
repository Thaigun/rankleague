import { createServerFn } from '@tanstack/react-start';
import { authMiddleware } from '../middleware/authMiddleware';
import { db } from '../../src/database/db';

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
        return leagues;
    });
