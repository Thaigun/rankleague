import { createFileRoute } from '@tanstack/react-router';
import { collectLeagueInfo } from '@app/serverFunctions/collectLeagueInfo';

export const Route = createFileRoute('/league/$leagueId')({
    component: League,
    loader: async ({ params }) => {
        const leagueId = params.leagueId;
        return collectLeagueInfo({ data: { leagueId } });
    },
});

function League() {
    const leagueInfo = Route.useLoaderData();

    return <div>{leagueInfo}</div>;
}
