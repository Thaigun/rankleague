import { Link, type LinkComponentProps } from '@tanstack/react-router';
import { ArrowLeftCircle } from './icons/ArrowLeftCircle';

interface NavigateBackLinkProps extends Omit<LinkComponentProps, 'children'> {
    label: string;
}

export function NavigateBackLink(props: NavigateBackLinkProps) {
    return (
        <Link {...props}>
            <div className='flex flex-row items-center gap-1 text-lg'>
                <ArrowLeftCircle />
                <span>{props.label}</span>
            </div>
        </Link>
    );
}
