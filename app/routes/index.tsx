import { createFileRoute, useRouter } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
    component: Home,
});

function Home() {
    const router = useRouter();

    return <h1>Current path was {router.basepath}</h1>;
}
