import { SubmitButton } from '@src/components/buttons/SubmitButton';
import { Form, Input, Label } from '@src/components/Form';
import { FormHeader } from '@src/components/Headers';
import { FormEvent, useState } from 'react';

interface CreateLeagueFormProps {
    onSubmit: (data: {
        leagueId: string;
        leagueName: string;
        leagueDescription: string;
        leaguePassword: string;
    }) => void | Promise<void>;
}

export function CreateLeagueForm(props: CreateLeagueFormProps) {
    const [leagueId, setLeagueId] = useState('');
    const [leagueName, setLeagueName] = useState('');
    const [leagueDescription, setLeagueDescription] = useState('');
    const [leaguePassword, setLeaguePassword] = useState('');

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        void props.onSubmit({
            leagueId,
            leagueName,
            leagueDescription,
            leaguePassword,
        });
        resetForm();
    }

    function resetForm() {
        setLeagueId('');
        setLeagueName('');
        setLeagueDescription('');
        setLeaguePassword('');
    }

    return (
        <Form onSubmit={handleSubmit}>
            <FormHeader>Create League</FormHeader>
            <Label>
                League unique ID:
                <Input name='leagueId' value={leagueId} onChange={setLeagueId} />
            </Label>
            <Label>
                League Name:
                <Input name='leagueName' value={leagueName} onChange={setLeagueName} />
            </Label>
            <Label>
                League description:
                <Input name='leagueDescription' value={leagueDescription} onChange={setLeagueDescription} />
            </Label>
            <Label>
                League password:
                <Input
                    type='password'
                    name='leaguePassword'
                    value={leaguePassword}
                    onChange={setLeaguePassword}
                />
            </Label>
            <SubmitButton>Create League</SubmitButton>
        </Form>
    );
}
