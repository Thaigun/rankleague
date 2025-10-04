import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod/v4';
import { db } from '@database/db';
import { authMiddleware } from '@src/middleware/authMiddleware';
import { setCookieWithLeagues } from './serverUtils/authTokenUtils';
import { zodValidator } from '@tanstack/zod-adapter';

const createLeagueFnSchema = z.object({
    leagueName: z.string(),
    leagueDescription: z.string(),
    leagueId: z.string(),
    leaguePassword: z.string(),
});

export const createLeagueFn = createServerFn({ method: 'POST' })
    .middleware([authMiddleware])
    .inputValidator(zodValidator(createLeagueFnSchema))
    .handler(async ({ data, context }) => {
        const hashedPassword = await Bun.password.hash(data.leaguePassword);
        await db
            .insertInto('league')
            .values({
                id: data.leagueId,
                name: data.leagueName,
                description: data.leagueDescription,
                hashed_password: hashedPassword,
            })
            .execute();

        const leagueMemberships = [data.leagueId];

        if (context.auth?.leagues) {
            leagueMemberships.push(...context.auth.leagues);
        }
        setCookieWithLeagues(leagueMemberships);
    });
