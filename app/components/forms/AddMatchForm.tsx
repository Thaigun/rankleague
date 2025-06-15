interface AddMatchFormProps {
    members: { id: number; name: string }[];
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function AddMatchForm(props: AddMatchFormProps) {
    return (
        <form onSubmit={props.onSubmit}>
            <label>
                Player 1
                <select name='member1_id' required>
                    {props.members.map((member) => (
                        <option key={member.id} value={member.id}>
                            {member.name}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Player 2
                <select name='member2_id' required>
                    {props.members.map((member) => (
                        <option key={member.id} value={member.id}>
                            {member.name}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Player 1 Score
                <input name='member1_score' type='number' required />
            </label>
            <label>
                Player 2 Score
                <input name='member2_score' type='number' required />
            </label>
            <button type='submit'>Add Match</button>
        </form>
    );
}
