import { NavigateBackLink } from '@src/components/NavigateBackLink';
import { collectMatchInfo } from '@src/serverFunctions/collectMatchInfo';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_layout/league/$leagueId/match/$matchId')({
    component: Match,
    loader: async ({ params }) => {
        const leagueId = params.leagueId;
        const matchId = parseInt(params.matchId);
        if (isNaN(matchId)) {
            throw new Error('Match ID must be a number', { cause: params.matchId });
        }
        return collectMatchInfo({ data: { matchId, leagueId } });
    },
});

function Match() {
    const matchInfo = Route.useLoaderData();
    const params = Route.useParams();
    const [formattedDate, setFormattedDate] = useState('');

    const member1RatingChange = matchInfo.member1.newRating - matchInfo.member1.previousRating;
    const member2RatingChange = matchInfo.member2.newRating - matchInfo.member2.previousRating;

    useEffect(() => {
        setFormattedDate(new Date(matchInfo.match.datetime).toLocaleString());
    }, [matchInfo.match.datetime]);

    return (
        <div className='flex flex-col gap-2'>
            <NavigateBackLink
                to='/league/$leagueId'
                params={{ leagueId: params.leagueId }}
                label='Back to League'
            />
            <h1 className='text-xl'>Match Details</h1>
            <p>Date: {formattedDate}</p>
            <p>
                Score: {matchInfo.match.member1_score} - {matchInfo.match.member2_score}
            </p>

            <h2 className='text-lg'>Players</h2>
            <div>
                <h3 className='text-md'>{matchInfo.member1.name}</h3>
                <p>Score: {matchInfo.match.member1_score}</p>
                <p>Previous Rating: {matchInfo.member1.previousRating.toFixed(0)}</p>
                <p>New Rating: {matchInfo.member1.newRating.toFixed(0)}</p>
                <p>
                    Change: {member1RatingChange > 0 ? '+' : ''}
                    {member1RatingChange.toFixed(0)}
                </p>
            </div>

            <div>
                <h3 className='text-md'>{matchInfo.member2.name}</h3>
                <p>Score: {matchInfo.match.member2_score}</p>
                <p>Previous Rating: {matchInfo.member2.previousRating.toFixed(0)}</p>
                <p>New Rating: {matchInfo.member2.newRating.toFixed(0)}</p>
                <p>
                    Change: {member2RatingChange > 0 ? '+' : ''}
                    {member2RatingChange.toFixed(0)}
                </p>
            </div>
        </div>
    );
}
