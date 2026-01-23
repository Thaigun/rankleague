import { EditButton } from '@src/components/buttons/EditButton';
import { SaveButton } from '@src/components/buttons/SaveButton';
import { Input } from '@src/components/Form';
import { NavigateBackLink } from '@src/components/NavigateBackLink';
import { collectMatchInfoFn } from '@src/serverFunctions/collectMatchInfo';
import { editMatchScoreFn } from '@src/serverFunctions/editMatchScore';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';

export const Route = createFileRoute('/_layout/league/$leagueId/match/$matchId')({
    component: Match,
    loader: async ({ params }) => {
        const leagueId = params.leagueId;
        const matchId = parseInt(params.matchId);
        if (isNaN(matchId)) {
            throw new Error('Match ID must be a number', { cause: params.matchId });
        }
        return collectMatchInfoFn({ data: { matchId, leagueId } });
    },
});

function Match() {
    const matchInfo = Route.useLoaderData();
    const params = Route.useParams();
    const router = useRouter();
    const [formattedDate, setFormattedDate] = useState('');
    const [scoreEditMode, setScoreEditMode] = useState(false);
    const [member1EditedScore, setMember1EditedScore] = useState(matchInfo.match.member1_score);
    const [member2EditedScore, setMember2EditedScore] = useState(matchInfo.match.member2_score);

    const member1RatingChange = matchInfo.member1.newRating - matchInfo.member1.previousRating;
    const member2RatingChange = matchInfo.member2.newRating - matchInfo.member2.previousRating;

    useEffect(() => {
        setFormattedDate(new Date(matchInfo.match.datetime).toLocaleString());
    }, [matchInfo.match.datetime]);

    const handleScoreSave = useCallback(async () => {
        await editMatchScoreFn({
            data: {
                leagueId: params.leagueId,
                matchId: matchInfo.match.id,
                member1Score: member1EditedScore,
                member2Score: member2EditedScore,
            },
        });
        setScoreEditMode(false);
        await router.invalidate();
    }, [
        member1EditedScore,
        member2EditedScore,
        matchInfo.match.id,
        matchInfo.match.member1_score,
        matchInfo.match.member2_score,
    ]);

    return (
        <div className='flex flex-col gap-2'>
            <NavigateBackLink
                to='/league/$leagueId'
                params={{ leagueId: params.leagueId }}
                label='Back to League'
            />
            <h1 className='text-xl'>Match Details</h1>
            <p>Date: {formattedDate}</p>
            <div className='flex flex-row items-center gap-2'>
                {scoreEditMode ? (
                    <>
                        <p>Score: </p>
                        <Input
                            type='number'
                            name='member1_score'
                            value={member1EditedScore}
                            onChange={setMember1EditedScore}
                        />
                        <span>-</span>
                        <Input
                            type='number'
                            name='member2_score'
                            value={member2EditedScore}
                            onChange={setMember2EditedScore}
                        />
                        <SaveButton onClick={() => void handleScoreSave()} />
                    </>
                ) : (
                    <>
                        <p>
                            Score: {matchInfo.match.member1_score} - {matchInfo.match.member2_score}
                        </p>
                        <EditButton onClick={() => setScoreEditMode(true)} />
                    </>
                )}
            </div>

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
