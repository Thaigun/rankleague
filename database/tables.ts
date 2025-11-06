import type { GeneratedAlways, Insertable, Selectable, Updateable, ColumnType, Generated } from 'kysely';

export interface Database {
    member: MemberTable;
    league: LeagueTable;
    match: MatchTable;
    rating_history: RatingHistoryTable;
}

interface MemberTable {
    id: GeneratedAlways<number>;
    name: string;
    joined_at: ColumnType<Date, never, never>;
    league_id: string;
    glicko2_rating: Generated<number>;
    glicko2_rating_deviation: Generated<number>;
    glicko2_volatility: Generated<number>;
}
export type Member = Selectable<MemberTable>;
export type MemberInsert = Insertable<MemberTable>;
export type MemberUpdate = Updateable<MemberTable>;

interface LeagueTable {
    id: string;
    name: string;
    description: string;
    hashed_password: string;
    created_at: GeneratedAlways<Date>;
}
export type League = Selectable<LeagueTable>;
export type LeagueInsert = Insertable<LeagueTable>;
export type LeagueUpdate = Updateable<LeagueTable>;

interface MatchTable {
    id: GeneratedAlways<number>;
    member1_id: number;
    member2_id: number;
    member1_score: number;
    member2_score: number;
    datetime: GeneratedAlways<Date>;
}
export type Match = Selectable<MatchTable>;
export type MatchInsert = Insertable<MatchTable>;
export type MatchUpdate = Updateable<MatchTable>;

interface RatingHistoryTable {
    id: GeneratedAlways<number>;
    member_id: number;
    glicko2_rating: number;
    glicko2_rating_deviation: number;
    glicko2_volatility: number;
    after_match_id: number;
}
export type RatingHistory = Selectable<RatingHistoryTable>;
export type RatingHistoryInsert = Insertable<RatingHistoryTable>;
export type RatingHistoryUpdate = Updateable<RatingHistoryTable>;
