import { SubmitButton } from '@src/components/buttons/SubmitButton';
import { Form, Input, Label } from '@src/components/Form';
import { FormEvent, useState } from 'react';

interface AddLeagueMemberFormProps {
    onSubmit: (data: { memberName: string }) => void | Promise<void>;
}

export function AddLeagueMemberForm(props: AddLeagueMemberFormProps) {
    const [memberName, setMemberName] = useState('');

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setMemberName('');
        void props.onSubmit({ memberName });
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Label>
                Member Name:
                <Input name='memberName' type='text' value={memberName} onChange={setMemberName} />
            </Label>
            <SubmitButton>Add Member</SubmitButton>
        </Form>
    );
}
