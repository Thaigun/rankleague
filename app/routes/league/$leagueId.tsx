import { AddLeagueMemberForm } from '@app/components/forms/AddLeagueMemberForm';
import { addLeagueMemberFn } from '@app/serverFunctions/addLeagueMember';
import { collectLeagueInfo } from '@app/serverFunctions/collectLeagueInfo';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { z } from 'zod/v4';

export const Route = createFileRoute('/league/$leagueId')({
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

    const handleAddLeagueMemberSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        await addLeagueMemberFn({
            data: {
                leagueId: params.leagueId,
                memberName: z.string().parse(formData.get('memberName')),
            },
        });
        await router.invalidate();
    };

    return (
        <div>
            <div>
                <h1 className='text-xl'>{leagueInfo.league.name}</h1>
                <p>{leagueInfo.league.description}</p>
            </div>
            <div>
                <h2 className='text-lg'>Members</h2>
                <ul>
                    {leagueInfo.members.map((member) => (
                        <li key={member.id}>{member.name}</li>
                    ))}
                </ul>
                <AddLeagueMemberForm onSubmit={handleAddLeagueMemberSubmit} />
            </div>
            <div>
                <h2 className='text-lg'>Matches</h2>
                <ul>
                    {leagueInfo.matches.map((match) => (
                        <li key={match.match_id}>
                            {match.member1_name} vs {match.member2_name} - {match.member1_score}:
                            {match.member2_score} on {new Date(match.match_datetime).toLocaleString()}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
