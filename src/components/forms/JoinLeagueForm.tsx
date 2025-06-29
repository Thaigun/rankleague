import { SubmitButton } from '@src/components/buttons/SubmitButton';
import { Form, Label, Input } from '@src/components/Form';
import { FormHeader } from '@src/components/Headers';

interface JoinLeagueFormProps {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function JoinLeagueForm(props: JoinLeagueFormProps) {
    return (
        <Form onSubmit={props.onSubmit}>
            <FormHeader>Join League</FormHeader>
            <Label>
                League ID:
                <Input name='leagueId' />
            </Label>
            <Label>
                League password:
                <Input name='leaguePassword' type='password' />
            </Label>
            <SubmitButton>Join League</SubmitButton>
        </Form>
    );
}
