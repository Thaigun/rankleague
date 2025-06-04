interface CreateLeagueFormProps {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function CreateLeagueForm(props: CreateLeagueFormProps) {
    return (
        <form onSubmit={props.onSubmit}>
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
    );
}
