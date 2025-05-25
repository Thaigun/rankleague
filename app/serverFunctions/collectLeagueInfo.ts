import { createServerFn } from '@tanstack/react-start';
import { leagueMembershipMiddleware } from '../middleware/leagueMembershipMiddleware';

export const collectLeagueInfo = createServerFn()
    .middleware([leagueMembershipMiddleware])
    .handler(async ({ context, data }) => {
        return 'hello';
    });
