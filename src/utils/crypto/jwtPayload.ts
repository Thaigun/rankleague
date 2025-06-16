import { z } from 'zod/v4';

export const jwtUserPayload = z.object({
    leagues: z.array(z.string()),
});

export type JwtUserPayload = z.infer<typeof jwtUserPayload>;

export const jwtFullPayloadSchema = jwtUserPayload.extend({
    iat: z.number(),
    exp: z.number(),
});

export type JwtFullPayload = z.infer<typeof jwtFullPayloadSchema>;
