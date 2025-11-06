import { leagueMembershipMiddleware } from '@src/middleware/leagueMembershipMiddleware';
import { createServerFn } from '@tanstack/react-start';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod/v4';
import { addNewMatch } from './serverUtils/addNewMatch';

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
        await addNewMatch(data);
    });
