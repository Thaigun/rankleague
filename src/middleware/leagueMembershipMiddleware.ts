import { createMiddleware } from '@tanstack/react-start';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod/v4';
import { authMiddleware } from './authMiddleware';

const leagueMembershipMiddlewareSchema = z
    .object({
        leagueId: z.string(),
    })
    .catchall(z.unknown());

export const leagueMembershipMiddleware = createMiddleware({
    type: 'function',
})
    .middleware([authMiddleware])
    .inputValidator(zodValidator(leagueMembershipMiddlewareSchema))
    .server(async ({ next, data, context }) => {
        if (!context.auth?.leagues.includes(data.leagueId)) {
            throw new Error('Not a member of this league');
        }
        return next();
    });
