interface JoinLeagueFormProps {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function JoinLeagueForm(props: JoinLeagueFormProps) {
    return (
        <form onSubmit={props.onSubmit}>
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
    );
}
