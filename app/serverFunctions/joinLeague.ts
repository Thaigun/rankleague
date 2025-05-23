import { createServerFn } from '@tanstack/react-start';
import { authMiddleware } from '../middleware/authMiddleware';
import { db } from '../../src/database/db';
import { sign } from '../../src/crypto/jwt';
import { setCookie } from '@tanstack/react-start/server';
import { z } from 'zod/v4';

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

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT secret not found');
        }
        const authPayload = {
            leagues: leagueMemberships,
        };
        const expiration = 60 * 60 * 24 * 30 * 12 * 10;
        const token = sign(authPayload, secret, expiration);
        setCookie('auth', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: expiration,
        });
    });
