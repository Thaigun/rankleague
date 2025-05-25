import { CreateLeagueForm } from '@app/components/forms/CreateLeagueForm';
import { JoinLeagueForm } from '@app/components/forms/JoinLeagueForm';
import { JoinedLeagues } from '@app/components/JoinedLeagues';
import { LogoText } from '@app/components/LogoText';
import { createLeagueFn } from '@app/serverFunctions/createLeague';
import { findJoinedLeaguesFn } from '@app/serverFunctions/findJoinedLeagues';
import { joinLeagueFn } from '@app/serverFunctions/joinLeague';
import { createFileRoute, useRouter } from '@tanstack/react-router';

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
