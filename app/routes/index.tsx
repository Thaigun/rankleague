import { createFileRoute, useRouter } from '@tanstack/react-router';
import { JoinedLeagues } from '../components/JoinedLeagues';
import { LogoText } from '../components/LogoText';
import { joinLeagueFn } from '../serverFunctions/joinLeague';
import { createLeagueFn } from '../serverFunctions/createLeague';
import { findJoinedLeaguesFn } from '../serverFunctions/findJoinedLeagues';
import { JoinLeagueForm } from '../components/forms/JoinLeagueForm';
import { CreateLeagueForm } from '../components/forms/CreateLeagueForm';

export const Route = createFileRoute('/')({
    component: Home,
    loader: async () => {
        const leagues = await findJoinedLeaguesFn();
        return { leagues };
    },
});

function Home() {
    const loaderData = Route.useLoaderData();
    const router = useRouter();

    const handleJoinLeagueSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        await joinLeagueFn({ data: formData });
        await router.invalidate();
    };

    const handleCreateLeagueSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        await createLeagueFn({ data: formData });
        await router.invalidate();
    };

    return (
        <div>
            <LogoText />
            <JoinedLeagues leagues={loaderData.leagues} />
            <JoinLeagueForm handleJoinLeagueSubmit={handleJoinLeagueSubmit} />
            <CreateLeagueForm handleCreateLeagueSubmit={handleCreateLeagueSubmit} />
        </div>
    );
}
