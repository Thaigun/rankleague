import { SubmitButton } from '@src/components/buttons/SubmitButton';
import { Form, Input, Label, Select } from '@src/components/Form';
import { FormEvent, useMemo, useState } from 'react';

interface AddMatchFormProps {
    members: { id: number; name: string }[];
    onSubmit: (data: {
        member1Id: number;
        member2Id: number;
        member1Score: number;
        member2Score: number;
    }) => void | Promise<void>;
}

export function AddMatchForm(props: AddMatchFormProps) {
    const alphabeticalMembers = useMemo(() => {
        return [...props.members].sort((a, b) => a.name.localeCompare(b.name));
    }, [props.members]);

    const [member1Id, setMember1Id] = useState(alphabeticalMembers.at(0)?.id.toString() ?? '');
    const [member2Id, setMember2Id] = useState(alphabeticalMembers.at(1)?.id.toString() ?? '');
    const [member1Score, setMember1Score] = useState('');
    const [member2Score, setMember2Score] = useState('');

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        void props.onSubmit({
            member1Id: Number(member1Id),
            member2Id: Number(member2Id),
            member1Score: Number(member1Score),
            member2Score: Number(member2Score),
        });
        setMember1Score('');
        setMember2Score('');
    }

    const disableSubmit =
        isNaN(Number(member1Id)) ||
        isNaN(Number(member2Id)) ||
        isNaN(Number(member1Score)) ||
        isNaN(Number(member2Score)) ||
        member1Id === member2Id;

    return (
        <Form onSubmit={handleSubmit}>
            <Label>
                Player 1
                <Select name='member1_id' value={member1Id} onChange={setMember1Id} required>
                    {alphabeticalMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                            {member.name}
                        </option>
                    ))}
                </Select>
            </Label>
            <Label>
                Player 2
                <Select name='member2_id' value={member2Id} onChange={setMember2Id} required>
                    {alphabeticalMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                            {member.name}
                        </option>
                    ))}
                </Select>
            </Label>
            <Label>
                Player 1 Score
                <Input
                    name='member1_score'
                    type='number'
                    value={member1Score}
                    onChange={setMember1Score}
                    required
                />
            </Label>
            <Label>
                Player 2 Score
                <Input
                    name='member2_score'
                    type='number'
                    value={member2Score}
                    onChange={setMember2Score}
                    required
                />
            </Label>
            <SubmitButton disabled={disableSubmit}>Add Match</SubmitButton>
        </Form>
    );
}
