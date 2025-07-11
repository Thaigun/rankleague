import { PropsWithChildren } from 'react';

type FormProps = PropsWithChildren<{
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}>;

export function Form(props: FormProps) {
    return (
        <form onSubmit={props.onSubmit} className='flex flex-col items-start gap-2'>
            {props.children}
        </form>
    );
}

type LabelProps = PropsWithChildren;

export function Label(props: LabelProps) {
    return <label className='flex flex-col items-start gap-1 text-sm'>{props.children}</label>;
}

interface InputProps {
    name: string;
    type?: 'text' | 'number' | 'password';
    required?: boolean;
}

export function Input(props: InputProps) {
    return (
        <input
            name={props.name}
            type={props.type ?? 'text'}
            required={props.required}
            className='rounded-sm border border-slate-400 p-1'
        />
    );
}

type SelectProps = PropsWithChildren<{
    name: string;
    required?: boolean;
}>;

export function Select(props: SelectProps) {
    return (
        <select
            name={props.name}
            required={props.required}
            className='rounded-sm border border-slate-400 p-2'
        >
            {props.children}
        </select>
    );
}
