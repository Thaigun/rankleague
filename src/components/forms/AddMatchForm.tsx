import { SubmitButton } from '@src/components/buttons/SubmitButton';
import { Form, Input, Label, Select } from '@src/components/Form';

interface AddMatchFormProps {
    members: { id: number; name: string }[];
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function AddMatchForm(props: AddMatchFormProps) {
    return (
        <Form onSubmit={props.onSubmit}>
            <Label>
                Player 1
                <Select name='member1_id' required>
                    {props.members.map((member) => (
                        <option key={member.id} value={member.id}>
                            {member.name}
                        </option>
                    ))}
                </Select>
            </Label>
            <Label>
                Player 2
                <Select name='member2_id' required>
                    {props.members.map((member) => (
                        <option key={member.id} value={member.id}>
                            {member.name}
                        </option>
                    ))}
                </Select>
            </Label>
            <Label>
                Player 1 Score
                <Input name='member1_score' type='number' required />
            </Label>
            <Label>
                Player 2 Score
                <Input name='member2_score' type='number' required />
            </Label>
            <SubmitButton>Add Match</SubmitButton>
        </Form>
    );
}
