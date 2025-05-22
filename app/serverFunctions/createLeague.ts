import { createServerFn } from '@tanstack/react-start';
import { authMiddleware } from '../middleware/authMiddleware';
import { db } from '../../src/database/db';
import { sign } from '../../src/crypto/jwt';
import { setCookie } from '@tanstack/react-start/server';

export const createLeagueFn = createServerFn({ method: 'POST' })
    .middleware([authMiddleware])
    .validator((data) => {
        if (!(data instanceof FormData)) {
            throw new Error('FormData is required');
        }
        const leagueName = data.get('leagueName');
        const leagueDescription = data.get('leagueDescription');
        const leagueId = data.get('leagueId');
        const leaguePassword = data.get('leaguePassword');
        if (
            typeof leagueId !== 'string' ||
            typeof leaguePassword !== 'string' ||
            typeof leagueName !== 'string' ||
            typeof leagueDescription !== 'string'
        ) {
            throw new Error('leagueId and leaguePassword are required');
        }
        return {
            leagueName,
            leagueDescription,
            leagueId,
            leaguePassword,
        };
    })
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

        if (context.auth) {
            const currentLeagues = context.auth.leagues ?? [];
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
