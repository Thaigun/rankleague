interface AddLeagueMemberFormProps {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function AddLeagueMemberForm(props: AddLeagueMemberFormProps) {
    return (
        <form onSubmit={props.onSubmit}>
            <label>
                Member Name:
                <input name='memberName' type='text' required />
            </label>
            <button type='submit'>Add Member</button>
        </form>
    );
}
