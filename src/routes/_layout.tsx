import { LogoText } from '@src/components/LogoText';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className='flex flex-col gap-5'>
            <div className='self-start'>
                <LogoText />
            </div>
            <Outlet />
        </div>
    );
}
