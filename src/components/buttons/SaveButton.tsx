import { Floppy } from '../icons/Floppy';

export function SaveButton(props: { onClick?: () => void }) {
    return (
        <button
            onClick={props.onClick}
            className='flex cursor-pointer flex-row items-center gap-1 rounded-sm border border-slate-400 px-2 py-1'
        >
            <Floppy /> Save
        </button>
    );
}
