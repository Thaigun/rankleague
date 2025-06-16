import { SubmitButton } from '@src/components/buttons/SubmitButton';

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
            <SubmitButton>Add Member</SubmitButton>
        </form>
    );
}
