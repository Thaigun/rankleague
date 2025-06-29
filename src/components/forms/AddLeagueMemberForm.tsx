import { SubmitButton } from '@src/components/buttons/SubmitButton';
import { Form, Input, Label } from '@src/components/Form';

interface AddLeagueMemberFormProps {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function AddLeagueMemberForm(props: AddLeagueMemberFormProps) {
    return (
        <Form onSubmit={props.onSubmit}>
            <Label>
                Member Name:
                <Input name='memberName' type='text' />
            </Label>
            <SubmitButton>Add Member</SubmitButton>
        </Form>
    );
}
