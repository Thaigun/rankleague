import { createMiddleware } from '@tanstack/react-start';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod/v4';
import { authMiddleware } from './authMiddleware';

const leagueMembershipMiddlewareSchema = z.object({
    leagueId: z.string(),
});

export const leagueMembershipMiddleware = createMiddleware({})
    .middleware([authMiddleware])
    .validator(zodValidator(leagueMembershipMiddlewareSchema))
    .server(async ({ next, data, context }) => {
        if (!context.auth?.leagues.includes(data.leagueId)) {
            throw new Error('Not a member of this league');
        }
        return next();
    });
