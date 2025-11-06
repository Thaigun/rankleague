import { NavigateBackLink } from '@src/components/NavigateBackLink';
import { collectMatchInfo } from '@src/serverFunctions/collectMatchInfo';
import { createFileRoute } from '@tanstack/react-router';

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

    return (
        <div>
            <NavigateBackLink
                to='/league/$leagueId'
                params={{ leagueId: params.leagueId }}
                label='Back to League'
            />
            <h1>Match Details</h1>
            <p>League ID: {params.leagueId}</p>
            <p>Match ID: {params.matchId}</p>
            <p>Member 1: {matchInfo.member1.name}</p>
            <p>Member 2: {matchInfo.member2.name}</p>
        </div>
    );
}
