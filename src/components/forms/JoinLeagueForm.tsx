import { SubmitButton } from '@src/components/buttons/SubmitButton';
import { Form, Label, Input } from '@src/components/Form';
import { FormHeader } from '@src/components/Headers';
import { FormEvent, useState } from 'react';

interface JoinLeagueFormProps {
    onSubmit: (data: { leagueId: string; leaguePassword: string }) => void;
}

export function JoinLeagueForm(props: JoinLeagueFormProps) {
    const [leagueId, setLeagueId] = useState('');
    const [leaguePassword, setLeaguePassword] = useState('');

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        props.onSubmit({
            leagueId,
            leaguePassword,
        });
        resetForm();
    }

    function resetForm() {
        setLeagueId('');
        setLeaguePassword('');
    }

    return (
        <Form onSubmit={handleSubmit}>
            <FormHeader>Join League</FormHeader>
            <Label>
                League ID:
                <Input name='leagueId' value={leagueId} onChange={setLeagueId} />
            </Label>
            <Label>
                League password:
                <Input
                    name='leaguePassword'
                    type='password'
                    value={leaguePassword}
                    onChange={setLeaguePassword}
                />
            </Label>
            <SubmitButton>Join League</SubmitButton>
        </Form>
    );
}
