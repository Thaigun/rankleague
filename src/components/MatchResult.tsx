import { useEffect, useState } from 'react';

interface MatchResultProps {
    member1: MatchMember;
    member2: MatchMember;
    time: Date;
}

interface MatchMember {
    name: string;
    score: number;
}

export function MatchResult(props: MatchResultProps) {
    const { member1, member2, time } = props;
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const isWinner1 = member1.score > member2.score;
    const isWinner2 = member2.score > member1.score;

    const formattedDate = isClient ? time.toLocaleDateString() : '';
    const formattedTime = isClient ? time.toLocaleTimeString() : '';

    return (
        <div className='flex flex-row flex-wrap justify-between rounded-lg border border-gray-200 p-2 shadow-md'>
            <div className='px-1 text-sm'>
                <span className={isWinner1 ? 'font-bold' : ''}>{member1.name}</span> {member1.score} -{' '}
                {member2.score} <span className={isWinner2 ? 'font-bold' : ''}>{member2.name}</span>
            </div>
            <div className='px-1 text-sm text-gray-500'>
                {formattedDate} {formattedTime}
            </div>
        </div>
    );
}
