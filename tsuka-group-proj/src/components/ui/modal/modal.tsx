import ModalContainer from "./modal-container"

interface Props {
    children: React.ReactNode
    color: string
}

/**
 * A general component for a modal
 * @param color The background color of the modal
 * @param children The content of the modal
 */
const Modal: React.FC<Props> = ({color, children}) => {
    return (
        <ModalContainer>
            <div className={`xtraLarge:w-[30vw] medium:w-[40vw] w-[90vw] py-5 medium:max-h-[80vh] rounded-xl bg-${color} z-50 backdrop-blur-lg m-auto flex flex-col p-4`}>
                {children}
            </div>
        </ModalContainer>
    )
}

export default Modal