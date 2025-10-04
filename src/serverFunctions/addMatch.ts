import { leagueMembershipMiddleware } from '@src/middleware/leagueMembershipMiddleware';
import { db } from '@database/db';
import { createServerFn } from '@tanstack/react-start';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod/v4';

const addMatchFnSchema = z.object({
    member1Id: z.int(),
    member2Id: z.int(),
    member1Score: z.int(),
    member2Score: z.int(),
});

export const addMatchFn = createServerFn({ method: 'POST' })
    .middleware([leagueMembershipMiddleware])
    .inputValidator(zodValidator(addMatchFnSchema))
    .handler(async ({ data }) => {
        const { member1Id, member2Id, member1Score, member2Score } = data;

        await db
            .insertInto('match')
            .values({
                member1_id: member1Id,
                member2_id: member2Id,
                member1_score: member1Score,
                member2_score: member2Score,
            })
            .execute();
    });
