import { CreateLeagueForm } from '@src/components/forms/CreateLeagueForm';
import { JoinLeagueForm } from '@src/components/forms/JoinLeagueForm';
import { JoinedLeagues } from '@src/components/JoinedLeagues';
import { createLeagueFn } from '@src/serverFunctions/createLeague';
import { findJoinedLeaguesFn } from '@src/serverFunctions/findJoinedLeagues';
import { joinLeagueFn } from '@src/serverFunctions/joinLeague';
import { createFileRoute, useRouter } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/')({
    component: Home,
    loader: async () => {
        const leagues = await findJoinedLeaguesFn();
        return { leagues };
    },
});

function Home() {
    const loaderData = Route.useLoaderData();
    const router = useRouter();

    const handleJoinLeagueSubmit = async (data: { leagueId: string; leaguePassword: string }) => {
        await joinLeagueFn({ data });
        await router.invalidate();
    };

    const handleCreateLeagueSubmit = async (data: {
        leagueId: string;
        leagueName: string;
        leagueDescription: string;
        leaguePassword: string;
    }) => {
        await createLeagueFn({ data });
        await router.invalidate();
    };

    return (
        <div className='flex flex-col gap-10'>
            <JoinedLeagues leagues={loaderData.leagues} />
            <JoinLeagueForm onSubmit={handleJoinLeagueSubmit} />
            <CreateLeagueForm onSubmit={handleCreateLeagueSubmit} />
        </div>
    );
}
