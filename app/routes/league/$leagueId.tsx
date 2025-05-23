import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/league/$leagueId')({
    component: League,
});

function League() {
    return <div>Hello "/league/$leagueId"!</div>;
}
