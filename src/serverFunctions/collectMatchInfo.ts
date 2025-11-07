import { db } from '@database/db';
import { leagueMembershipMiddleware } from '@src/middleware/leagueMembershipMiddleware';
import { createServerFn } from '@tanstack/react-start';
import { zodValidator } from '@tanstack/zod-adapter';
import z from 'zod/v4';

const collectMatchInfoSchema = z.object({
    leagueId: z.string(),
    matchId: z.number(),
});

export const collectMatchInfo = createServerFn()
    .middleware([leagueMembershipMiddleware])
    .inputValidator(zodValidator(collectMatchInfoSchema))
    .handler(async ({ data }) => {
        const leagueId = data.leagueId;
        const matchId = data.matchId;

        const matchInfo = await db
            .selectFrom('match')
            .where('id', '=', matchId)
            .selectAll()
            .executeTakeFirst();
        if (!matchInfo) {
            throw new Error('Match not found');
        }

        const [member1, member2, matchRatingHistories, member1PreviousMatch, member2PreviousMatch] =
            await Promise.all([
                db
                    .selectFrom('member')
                    .where('id', '=', matchInfo.member1_id)
                    .where('league_id', '=', leagueId)
                    .select(['id', 'name'])
                    .executeTakeFirst(),
                db
                    .selectFrom('member')
                    .where('id', '=', matchInfo.member2_id)
                    .where('league_id', '=', leagueId)
                    .select(['id', 'name'])
                    .executeTakeFirst(),
                db
                    .selectFrom('rating_history')
                    .where('after_match_id', '=', matchId)
                    .select(['member_id', 'glicko2_rating'])
                    .execute(),
                db
                    .selectFrom('rating_history')
                    .innerJoin('match', 'match.id', 'rating_history.after_match_id')
                    .where('member_id', '=', matchInfo.member1_id)
                    .where('match.datetime', '<', matchInfo.datetime)
                    .orderBy('match.datetime', 'desc')
                    .limit(1)
                    .select('rating_history.glicko2_rating')
                    .executeTakeFirst(),
                db
                    .selectFrom('rating_history')
                    .innerJoin('match', 'match.id', 'rating_history.after_match_id')
                    .where('member_id', '=', matchInfo.member2_id)
                    .where('match.datetime', '<', matchInfo.datetime)
                    .orderBy('match.datetime', 'desc')
                    .limit(1)
                    .select('rating_history.glicko2_rating')
                    .executeTakeFirst(),
            ]);

        if (!member1 || !member2) {
            throw new Error('One or both members not found in the specified league');
        }

        // Find the rating history entries for each member after this match
        const member1AfterMatch = matchRatingHistories.find(
            (history) => history.member_id === matchInfo.member1_id,
        );
        const member2AfterMatch = matchRatingHistories.find(
            (history) => history.member_id === matchInfo.member2_id,
        );

        if (!member1AfterMatch || !member2AfterMatch) {
            throw new Error('Rating history not found for this match');
        }

        // Use default rating of 1500 if no previous match exists
        const DEFAULT_RATING = 1500;
        const member1PreviousRating = member1PreviousMatch?.glicko2_rating ?? DEFAULT_RATING;
        const member2PreviousRating = member2PreviousMatch?.glicko2_rating ?? DEFAULT_RATING;

        return {
            match: matchInfo,
            member1: {
                ...member1,
                previousRating: member1PreviousRating,
                newRating: member1AfterMatch.glicko2_rating,
            },
            member2: {
                ...member2,
                previousRating: member2PreviousRating,
                newRating: member2AfterMatch.glicko2_rating,
            },
        };
    });
