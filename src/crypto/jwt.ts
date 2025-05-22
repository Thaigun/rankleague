function base64Encode(input: string | Uint8Array): string {
    const bitArr = typeof input === 'string' ? new TextEncoder().encode(input) : input;
    return bitArr.toBase64({ alphabet: 'base64url', omitPadding: true });
}

function base64Decode(input: string): string {
    const bitArr = Uint8Array.fromBase64(input, { alphabet: 'base64url' });
    return new TextDecoder().decode(bitArr);
}

function hmacSha256(data: string, secret: string): string {
    const hasher = new Bun.CryptoHasher('sha256', secret);
    hasher.update(data);
    return hasher.digest().toBase64({ alphabet: 'base64url', omitPadding: true });
}

export function sign(payload: Record<string, any>, secret: string, expiresInSec = 3600): string {
    const header = {
        alg: 'HS256',
        typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);
    const fullPayload = {
        ...payload,
        iat: now,
        exp: now + expiresInSec,
    };

    const encodedHeader = base64Encode(JSON.stringify(header));
    const encodedPayload = base64Encode(JSON.stringify(fullPayload));
    const signature = hmacSha256(`${encodedHeader}.${encodedPayload}`, secret);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verify(token: string, secret: string): Record<string, any> | null {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;

    const expectedSig = hmacSha256(`${encodedHeader}.${encodedPayload}`, secret);

    if (signature !== expectedSig) return null;

    try {
        const payload = JSON.parse(base64Decode(encodedPayload));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && now > payload.exp) return null;
        return payload;
    } catch {
        return null;
    }
}
