import type { Generated } from 'kysely';

export interface Database {
    user: UserTable;
}

export interface UserTable {
    id: Generated<number>;
    username: string;
}
