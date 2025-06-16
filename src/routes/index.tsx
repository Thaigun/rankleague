import { CreateLeagueForm } from '@src/components/forms/CreateLeagueForm';
import { JoinLeagueForm } from '@src/components/forms/JoinLeagueForm';
import { JoinedLeagues } from '@src/components/JoinedLeagues';
import { LogoText } from '@src/components/LogoText';
import { createLeagueFn } from '@src/serverFunctions/createLeague';
import { findJoinedLeaguesFn } from '@src/serverFunctions/findJoinedLeagues';
import { joinLeagueFn } from '@src/serverFunctions/joinLeague';
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
            <JoinLeagueForm onSubmit={(e) => void handleJoinLeagueSubmit(e)} />
            <CreateLeagueForm onSubmit={(e) => void handleCreateLeagueSubmit(e)} />
        </div>
    );
}
