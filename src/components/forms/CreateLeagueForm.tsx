import { SubmitButton } from '@src/components/buttons/SubmitButton';
import { Form, Input, Label } from '@src/components/Form';
import { FormHeader } from '@src/components/Headers';

interface CreateLeagueFormProps {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function CreateLeagueForm(props: CreateLeagueFormProps) {
    return (
        <Form onSubmit={props.onSubmit}>
            <FormHeader>Create League</FormHeader>
            <Label>
                League unique ID:
                <Input name='leagueId' />
            </Label>
            <Label>
                League Name:
                <Input name='leagueName' />
            </Label>
            <Label>
                League description:
                <Input name='leagueDescription' />
            </Label>
            <Label>
                League password:
                <Input name='leaguePassword' />
            </Label>
            <SubmitButton>Create League</SubmitButton>
        </Form>
    );
}
