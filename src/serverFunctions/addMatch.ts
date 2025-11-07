import { leagueMembershipMiddleware } from '@src/middleware/leagueMembershipMiddleware';
import { createServerFn } from '@tanstack/react-start';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod/v4';
import { addNewMatch } from './serverUtils/addNewMatch';
import { db } from '@database/db';

const addMatchSchema = z.object({
    member1Id: z.int(),
    member2Id: z.int(),
    member1Score: z.int(),
    member2Score: z.int(),
});

export const addMatchFn = createServerFn({ method: 'POST' })
    .middleware([leagueMembershipMiddleware])
    .inputValidator(zodValidator(addMatchSchema))
    .handler(async ({ data }) => {
        const members = await db
            .selectFrom('member')
            .where('id', 'in', [data.member1Id, data.member2Id])
            .where('league_id', '=', data.leagueId)
            .select(['id'])
            .execute();

        if (members.length !== 2) {
            throw new Error('One or both members do not belong to the league');
        }
        await addNewMatch(data);
    });
