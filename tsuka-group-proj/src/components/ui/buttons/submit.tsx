export enum ButtonType {
    PRIMARY,
    SECONDARY
}

interface Props {
    text: string
    onClick: () => void
    type: ButtonType
}

const Submit: React.FC<Props> = ({onClick, text, type}) => {
    return (
        <button onClick={(e)=>{e.stopPropagation(); onClick()}} className={`${type == ButtonType.PRIMARY ? "bg-custom-primary text-white" : "text-custom-primary border border-custom-primary"} shadow-md w-full py-2 rounded-md mx-auto transition-all hover:scale-110`}>
            {text}
        </button>
    )
}

export default Submit