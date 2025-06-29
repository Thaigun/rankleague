import { PropsWithChildren } from 'react';

export function FormHeader(props: PropsWithChildren) {
    return <h2 className='text-lg font-bold'>{props.children}</h2>;
}
