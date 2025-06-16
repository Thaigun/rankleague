import { PropsWithChildren } from 'react';

export function SubmitButton(props: PropsWithChildren) {
    return (
        <button className='rounded-sm border border-slate-400 px-3 py-2' type='submit'>
            {props.children}
        </button>
    );
}
