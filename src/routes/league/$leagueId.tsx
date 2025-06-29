import { AddLeagueMemberForm } from '@src/components/forms/AddLeagueMemberForm';
import { AddMatchForm } from '@src/components/forms/AddMatchForm';
import { addLeagueMemberFn } from '@src/serverFunctions/addLeagueMember';
import { addMatchFn } from '@src/serverFunctions/addMatch';
import { collectLeagueInfo } from '@src/serverFunctions/collectLeagueInfo';
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

    const handleAddMatchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        await addMatchFn({
            data: {
                leagueId: params.leagueId,
                member1_id: parseInt(z.string().parse(formData.get('member1_id'))),
                member2_id: parseInt(z.string().parse(formData.get('member2_id'))),
                member1_score: parseInt(z.string().parse(formData.get('member1_score'))),
                member2_score: parseInt(z.string().parse(formData.get('member2_score'))),
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
                        <li key={member.id}>{member.name}</li>
                    ))}
                </ul>
                <AddLeagueMemberForm onSubmit={(e) => void handleAddLeagueMemberSubmit(e)} />
            </div>
            <div className='flex flex-col gap-2'>
                <h2 className='text-lg'>Matches</h2>
                <AddMatchForm members={leagueInfo.members} onSubmit={(e) => void handleAddMatchSubmit(e)} />
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
