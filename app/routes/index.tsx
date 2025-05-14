import { createFileRoute, useLoaderData, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { authMiddleware } from '../middleware/authMiddleware';

export const Route = createFileRoute('/')({
    component: Home,
    loader: () => {
        return sampleServerFn();
    },
});

const sampleServerFn = createServerFn()
    .middleware([authMiddleware])
    .handler(async ({ context }) => {
        return {
            visit: context.visit,
        };
    });

function Home() {
    const loader = Route.useLoaderData();

    return <h1 className='text-3xl underline'>First visit was at {loader.visit}</h1>;
}
