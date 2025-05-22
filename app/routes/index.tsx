import { createFileRoute } from '@tanstack/react-router';
import { JoinedLeagues } from '../components/JoinedLeagues';
import { LogoText } from '../components/LogoText';
import { joinLeagueFn } from '../serverFunctions/joinLeague';
import { createLeagueFn } from '../serverFunctions/createLeague';
import { findJoinedLeaguesFn } from '../serverFunctions/findJoinedLeagues';

export const Route = createFileRoute('/')({
    component: Home,
    loader: async () => {
        const leagues = await findJoinedLeaguesFn();
        return { leagues };
    },
});

function Home() {
    const loaderData = Route.useLoaderData();

    const handleJoinLeagueSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        await joinLeagueFn({ data: formData });
    };

    const handleCreateLeagueSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        await createLeagueFn({ data: formData });
    };

    return (
        <div>
            <LogoText />
            <JoinedLeagues leagues={loaderData.leagues} />
            <form onSubmit={handleJoinLeagueSubmit}>
                <label>
                    League ID:
                    <input name='leagueId' type='text' />
                </label>
                <label>
                    League password:
                    <input name='leaguePassword' type='password' />
                </label>
                <button type='submit'>Join League</button>
            </form>
            <form onSubmit={handleCreateLeagueSubmit}>
                <label>
                    League unique ID:
                    <input name='leagueId' type='text' />
                </label>
                <label>
                    League Name:
                    <input name='leagueName' type='text' />
                </label>
                <label>
                    League description:
                    <input name='leagueDescription' type='text' />
                </label>
                <label>
                    League password:
                    <input name='leaguePassword' type='password' />
                </label>
                <button type='submit'>Create League</button>
            </form>
        </div>
    );
}
