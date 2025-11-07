import { ChangeEvent, PropsWithChildren } from 'react';

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

type InputPropsBase = {
    name: string;
    required?: boolean;
};

type TextInputProps = InputPropsBase & {
    type?: 'text' | 'password';
    value: string;
    onChange: (val: string) => void;
};

type NumberInputProps = InputPropsBase & {
    type: 'number';
    value: number;
    onChange: (val: number) => void;
};

type InputProps = TextInputProps | NumberInputProps;

export function Input(props: InputProps) {
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        if (props.type === 'number') {
            props.onChange(e.target.valueAsNumber);
        } else {
            props.onChange(e.target.value);
        }
    }

    return (
        <input
            name={props.name}
            type={props.type ?? 'text'}
            value={props.value}
            onChange={handleChange}
            required={props.required}
            className='rounded-sm border border-slate-400 p-1'
        />
    );
}

type SelectProps = PropsWithChildren<{
    name: string;
    value: string;
    onChange: (val: string) => void;
    required?: boolean;
}>;

export function Select(props: SelectProps) {
    function handleChange(e: ChangeEvent<HTMLSelectElement>) {
        props.onChange(e.target.value);
    }

    return (
        <select
            name={props.name}
            required={props.required}
            onChange={handleChange}
            value={props.value}
            className='rounded-sm border border-slate-400 p-2'
        >
            {props.children}
        </select>
    );
}
