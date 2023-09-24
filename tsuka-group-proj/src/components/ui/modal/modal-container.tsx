interface Props {
    children: React.ReactNode
}

/**
 * This component wraps the modal component, and allows for it to be centered on screen. The modal component should be a child of this component
 */
const ModalContainer: React.FC<Props> = ({children}) => {
    return (
        <div className="fixed top-0 left-0 w-[100vw] h-[100vh] flex bg-[rgba(19,21,31,0.6)] backdrop-blur-[2px]">
            {children}
        </div>
    )
}

export default ModalContainer