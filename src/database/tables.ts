import type { GeneratedAlways, Insertable, Selectable, Updateable, ColumnType } from 'kysely';

export interface Database {
    member: MemberTable;
    league: LeagueTable;
    match: MatchTable;
}

interface MemberTable {
    id: GeneratedAlways<number>;
    name: string;
    joined_at: string;
    league_id: string;
    is_admin: boolean;
}
export type Member = Selectable<MemberTable>;
export type MemberInsert = Insertable<MemberTable>;
export type MemberUpdate = Updateable<MemberTable>;

interface LeagueTable {
    id: string;
    name: string;
    description: string;
    hashed_password: string;
    created_at: ColumnType<Date, never, never>;
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
    datetime: string;
}
export type Match = Selectable<MatchTable>;
export type MatchInsert = Insertable<MatchTable>;
export type MatchUpdate = Updateable<MatchTable>;
