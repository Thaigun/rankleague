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
                <div key={league.id} className='flex flex-col gap-2 rounded-md border p-4'>
                    <h3 className='text-xl'>{league.name}</h3>
                    <p>{league.description}</p>
                </div>
            ))}
        </div>
    );
}
