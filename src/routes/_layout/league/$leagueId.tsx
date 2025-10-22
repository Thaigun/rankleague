import { AddLeagueMemberForm } from '@src/components/forms/AddLeagueMemberForm';
import { AddMatchForm } from '@src/components/forms/AddMatchForm';
import { addLeagueMemberFn } from '@src/serverFunctions/addLeagueMember';
import { addMatchFn } from '@src/serverFunctions/addMatch';
import { collectLeagueInfo } from '@src/serverFunctions/collectLeagueInfo';
import { createFileRoute, useRouter } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/league/$leagueId')({
    component: League,
    loader: async ({ params }) => {
        const leagueId = params.leagueId;
        return collectLeagueInfo({ data: { leagueId } });
    },
});

function League() {
    const leagueInfo = Route.useLoaderData();
    const router = useRouter();
    const params = Route.useParams();

    const handleAddLeagueMemberSubmit = async (data: { memberName: string }) => {
        await addLeagueMemberFn({
            data: {
                leagueId: params.leagueId,
                ...data,
            },
        });
        await router.invalidate();
    };

    const handleAddMatchSubmit = async (data: {
        member1Id: number;
        member2Id: number;
        member1Score: number;
        member2Score: number;
    }) => {
        await addMatchFn({
            data: {
                leagueId: params.leagueId,
                ...data,
            },
        });
        await router.invalidate();
    };

    return (
        <div className='flex flex-col gap-5'>
            <div>
                <h1 className='text-xl'>{leagueInfo.league.name}</h1>
                <p>{leagueInfo.league.description}</p>
            </div>
            <div className='flex flex-col gap-2'>
                <h2 className='text-lg'>Members</h2>
                <ul>
                    {leagueInfo.members.map((member) => (
                        <li key={member.id}>
                            {member.name}: {Math.round(member.glicko2_rating)}
                        </li>
                    ))}
                </ul>
                <AddLeagueMemberForm onSubmit={handleAddLeagueMemberSubmit} />
            </div>
            <div className='flex flex-col gap-2'>
                <h2 className='text-lg'>Matches</h2>
                {leagueInfo.members.length > 1 && (
                    <AddMatchForm members={leagueInfo.members} onSubmit={handleAddMatchSubmit} />
                )}
                <ul>
                    {leagueInfo.matches.map((match) => (
                        <li key={match.match_id}>
                            {match.member1_name} vs {match.member2_name}: {match.member1_score}-
                            {match.member2_score} on {match.match_datetime.toString()}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
