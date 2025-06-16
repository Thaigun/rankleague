import { createServerFn } from '@tanstack/react-start';
import { leagueMembershipMiddleware } from '@src/middleware/leagueMembershipMiddleware';
import { db } from '@database/db';

export const collectLeagueInfo = createServerFn()
    .middleware([leagueMembershipMiddleware])
    .handler(async ({ data }) => {
        const leagueId = data.leagueId;
        const [league, members, matches] = await Promise.all([
            db
                .selectFrom('league')
                .where('id', '=', leagueId)
                .select(['id', 'name', 'description', 'created_at'])
                .executeTakeFirst(),
            db
                .selectFrom('member')
                .where('league_id', '=', leagueId)
                .select(['id', 'name', 'joined_at'])
                .execute(),
            db
                .selectFrom('match')
                .innerJoin('member as m1', 'm1.id', 'match.member1_id')
                .innerJoin('member as m2', 'm2.id', 'match.member2_id')
                .where('m1.league_id', '=', leagueId)
                .where('m2.league_id', '=', leagueId)
                .select([
                    'match.datetime as match_datetime',
                    'match.id as match_id',
                    'match.member1_score as member1_score',
                    'match.member2_score as member2_score',
                    'm1.id as member1_id',
                    'm1.name as member1_name',
                    'm2.id as member2_id',
                    'm2.name as member2_name',
                ])
                .execute(),
        ]);
        if (!league) {
            throw new Error('League not found');
        }
        return {
            league,
            members,
            matches,
        };
    });
