import { Link } from '@tanstack/react-router';

export function LogoText() {
    return (
        <Link to='/'>
            <h1 className='text-3xl'>
                <span className='underline'>Rank</span>
                <span>lig</span>
            </h1>
        </Link>
    );
}
