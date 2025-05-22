import { createServerFn } from '@tanstack/react-start';
import { authMiddleware } from '../middleware/authMiddleware';
import { db } from '../../src/database/db';
import { sign } from '../../src/crypto/jwt';
import { setCookie } from '@tanstack/react-start/server';

export const joinLeagueFn = createServerFn({ method: 'POST' })
    .middleware([authMiddleware])
    .validator((data) => {
        if (!(data instanceof FormData)) {
            throw new Error('FormData is required');
        }
        const leagueId = data.get('leagueId');
        const leaguePassword = data.get('leaguePassword');
        if (typeof leagueId !== 'string' || typeof leaguePassword !== 'string') {
            throw new Error('leagueId and leaguePassword are required');
        }
        return {
            leagueId,
            leaguePassword,
        };
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
        if (context.auth) {
            const currentLeagues = context.auth.leagues ?? [];
            if (currentLeagues.includes(data.leagueId)) {
                throw new Error('Already joined this league');
            }
            const updatedLeagues = [...currentLeagues, data.leagueId];
            const updatedAuth = {
                ...context.auth,
                leagues: updatedLeagues,
            };
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error('JWT secret not found');
            }
            const token = sign(updatedAuth, secret, 60 * 60 * 24 * 30 * 12 * 10);
            setCookie('auth', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 30 * 12 * 10,
            });
        } else {
            const newAuth = {
                leagues: [data.leagueId],
            };
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error('JWT secret not found');
            }
            const token = sign(newAuth, secret, 60 * 60 * 24 * 30 * 12 * 10);
            setCookie('auth', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 30 * 12 * 10,
            });
        }
    });
