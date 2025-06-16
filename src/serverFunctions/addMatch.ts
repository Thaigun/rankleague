import { leagueMembershipMiddleware } from '@src/middleware/leagueMembershipMiddleware';
import { db } from '@database/db';
import { createServerFn } from '@tanstack/react-start';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod/v4';

const addMatchFnSchema = z.object({
    member1_id: z.int(),
    member2_id: z.int(),
    member1_score: z.int(),
    member2_score: z.int(),
});

export const addMatchFn = createServerFn({ method: 'POST' })
    .middleware([leagueMembershipMiddleware])
    .validator(zodValidator(addMatchFnSchema))
    .handler(async ({ data }) => {
        const { member1_id, member2_id, member1_score, member2_score } = data;

        await db
            .insertInto('match')
            .values({
                member1_id,
                member2_id,
                member1_score,
                member2_score,
            })
            .execute();
    });
