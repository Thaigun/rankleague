import { createMiddleware } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { verify } from '../../src/crypto/jwt';

export const authMiddleware = createMiddleware().server(async ({ next }) => {
    const authCookie = getCookie('auth');
    const secret = process.env.JWT_SECRET;

    let verifiedToken: Record<string, any> | null = null;

    if (authCookie && secret) {
        verifiedToken = verify(authCookie, secret);
    }

    return next({
        context: {
            auth: verifiedToken,
        },
    });
});
