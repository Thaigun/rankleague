import { PropsWithChildren } from 'react';

export function SubmitButton(props: PropsWithChildren<{ disabled?: boolean }>) {
    return (
        <button
            className='cursor-pointer rounded-sm border border-slate-400 px-3 py-2'
            disabled={props.disabled}
            type='submit'
        >
            {props.children}
        </button>
    );
}
