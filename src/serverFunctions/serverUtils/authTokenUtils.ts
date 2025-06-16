import { setCookie } from '@tanstack/react-start/server';
import { sign } from '@src/utils/crypto/jwt';

export function setCookieWithLeagues(leagueIds: string[]) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT secret is not defined');
    }
    const authPayload = {
        leagues: leagueIds,
    };
    const expiration = 60 * 60 * 24 * 30 * 12 * 10;
    const token = sign(authPayload, secret, expiration);

    setCookie('auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: expiration,
    });
}
