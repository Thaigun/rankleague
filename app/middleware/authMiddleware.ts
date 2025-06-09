import { createMiddleware } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { verify } from '@app/utils/crypto/jwt';
import { JwtFullPayload } from '@app/utils/crypto/jwtPayload';

export const authMiddleware = createMiddleware().server(async ({ next }) => {
    const authCookie = getCookie('auth');
    const secret = process.env.JWT_SECRET;

    let verifiedToken: JwtFullPayload | null = null;

    if (authCookie && secret) {
        verifiedToken = verify(authCookie, secret);
    }

    return next({
        context: {
            auth: verifiedToken,
        },
    });
});
