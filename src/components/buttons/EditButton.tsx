import { Pencil } from '../icons/Pencil';

export function EditButton(props: { onClick?: () => void }) {
    return (
        <button
            onClick={props.onClick}
            className='flex cursor-pointer flex-row items-center gap-1 rounded-sm border border-slate-400 px-2 py-1'
        >
            <Pencil /> Edit
        </button>
    );
}
