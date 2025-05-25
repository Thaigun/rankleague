import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod/v4';
import { db } from '../../src/database/db';
import { authMiddleware } from '../middleware/authMiddleware';
import { setCookieWithLeagues } from './serverUtils/authTokenUtils';

const joinLeagueFnSchema = z.object({
    leagueId: z.string(),
    leaguePassword: z.string(),
});

export const joinLeagueFn = createServerFn({ method: 'POST' })
    .middleware([authMiddleware])
    .validator((data) => {
        if (!(data instanceof FormData)) {
            throw new Error('FormData is required');
        }
        return joinLeagueFnSchema.parse(Object.fromEntries(data.entries()));
    })
    .handler(async ({ data, context }) => {
        if (context.auth?.leagues?.includes(data.leagueId)) {
            throw new Error('Already a member of this league');
        }
        const league = await db
            .selectFrom('league')
            .where('id', '=', data.leagueId)
            .select('hashed_password')
            .executeTakeFirst();
        if (!league) {
            throw new Error('League not found');
        }
        const passwordOk = await Bun.password.verify(data.leaguePassword, league.hashed_password);
        if (!passwordOk) {
            throw new Error('Invalid password');
        }
        const leagueMemberships = [data.leagueId];
        if (context.auth?.leagues) {
            leagueMemberships.push(...context.auth.leagues);
        }
        setCookieWithLeagues(leagueMemberships);
    });
