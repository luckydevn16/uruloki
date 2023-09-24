interface Props {
    title: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * Simple text input component
 * @param title The title of the input
 * @param onChange A function which is called when the input is changed
 * @returns 
 */
const TextInput: React.FC<Props> = ({title, onChange}) => {
    return (
        <div className="flex flex-col">
            <p>{title}</p>
            <input onChange={onChange} className="w-full bg-tsuka-500 outline-none border border-tsuka-400 rounded-md px-3 py-2 text-sm"></input>
        </div>
    )
}

export default TextInput;