import { leagueMembershipMiddleware } from '@app/middleware/leagueMembershipMiddleware';
import { db } from '@src/database/db';
import { createServerFn } from '@tanstack/react-start';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod/v4';

const addLeagueMemberSchema = z.object({
    memberName: z.string(),
    leagueId: z.string(),
});

export const addLeagueMemberFn = createServerFn({ method: 'POST' })
    .middleware([leagueMembershipMiddleware])
    .validator(zodValidator(addLeagueMemberSchema))
    .handler(async ({ data }) => {
        const { memberName, leagueId } = data;
        const newMember = await db
            .insertInto('member')
            .values({
                name: memberName,
                league_id: leagueId,
            })
            .returning(['id', 'name'])
            .executeTakeFirst();

        return {
            member: newMember,
        };
    });
