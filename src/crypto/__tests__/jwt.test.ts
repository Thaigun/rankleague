import { expect, test, describe } from 'bun:test';
import { sign, verify } from '../jwt';

describe('JWT', () => {
    const secret = 'test-secret';
    const testPayload = {
        userId: '123',
        role: 'admin',
    };

    test('should correctly sign and verify a token', () => {
        const token = sign(testPayload, secret);
        const verified = verify(token, secret);

        expect(verified).not.toBeNull();
        expect(verified?.userId).toBe(testPayload.userId);
        expect(verified?.role).toBe(testPayload.role);
        expect(typeof verified?.iat).toBe('number');
        expect(typeof verified?.exp).toBe('number');
    });

    test('should reject a token with invalid signature', () => {
        const token = sign(testPayload, secret);
        const tamperedToken = token.substring(0, token.lastIndexOf('.') + 1) + 'invalid-signature';

        const verified = verify(tamperedToken, secret);
        expect(verified).toBeNull();
    });

    test('should reject an expired token', () => {
        // Create a token that expires immediately
        const token = sign(testPayload, secret, -10);
        const verified = verify(token, secret);

        expect(verified).toBeNull();
    });

    test('should reject a malformed token', () => {
        const malformedTokens = ['not-a-token', 'onlytwo.parts', 'too.many.parts.here', '.empty.parts'];

        for (const token of malformedTokens) {
            const verified = verify(token, secret);
            expect(verified).toBeNull();
        }
    });

    test('should reject a token with invalid JSON payload', () => {
        const parts = sign(testPayload, secret).split('.');
        // Create an invalid base64 payload
        const tamperedToken = `${parts[0]}.abc123.${parts[2]}`;

        const verified = verify(tamperedToken, secret);
        expect(verified).toBeNull();
    });

    test('should create token with custom expiration', () => {
        const customExpirationSecs = 7200; // 2 hours
        const token = sign(testPayload, secret, customExpirationSecs);
        const verified = verify(token, secret);

        expect(verified).not.toBeNull();
        if (verified) {
            const now = Math.floor(Date.now() / 1000);
            expect(verified.exp).toBeGreaterThan(now + customExpirationSecs - 10); // Allow small timing differences
            expect(verified.exp).toBeLessThan(now + customExpirationSecs + 10);
        }
    });
});
