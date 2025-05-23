import { Link } from '@tanstack/react-router';

interface JoinedLeaguesProps {
    leagues: {
        id: string;
        name: string;
        description: string;
    }[];
}

export function JoinedLeagues(props: JoinedLeaguesProps) {
    const { leagues } = props;
    return (
        <div className='flex flex-col gap-4'>
            <h2 className='text-2xl'>Joined Leagues</h2>
            {leagues.length === 0 && <p className='text-gray-500'>You are not a member of any leagues.</p>}
            {leagues.map((league) => (
                <Link
                    to={'/league/$leagueId'}
                    params={{ leagueId: league.id }}
                    key={league.id}
                    className='flex cursor-pointer flex-col gap-2 rounded-md border p-4'
                >
                    <h3 className='text-lg'>{league.name}</h3>
                    <p>{league.description}</p>
                </Link>
            ))}
        </div>
    );
}
