import { Strategy } from "@/types"
import axios from "axios"
import Modal from "./modal"
import ModalHeader from "./modal-header"
import Submit, { ButtonType } from "../buttons/submit"

interface DeleteModalProps {
    selectedSetup: Strategy
    setShowDeleteModal: (show: boolean) => void
    setSelectedSetup: (setup: Strategy | null) => void
    refresh: () => void
}

const DeleteSetupModal: React.FC<DeleteModalProps> = ({selectedSetup, setShowDeleteModal, setSelectedSetup, refresh}) => {
    async function submit() {
        await axios.delete(`/api/strategies/${selectedSetup.id}`)

        refresh()
        setSelectedSetup(null)
        setShowDeleteModal(false)
    }
    
    return (
      <Modal color={"[#1F2333]"}>
        <ModalHeader 
          title={`Delete ${selectedSetup.title}`}
          onClose={()=>{setSelectedSetup(null); setShowDeleteModal(false)}}
        />
        <div className="flex flex-row gap-10 mt-20">
            <Submit
                text="Delete"
                type={ButtonType.PRIMARY}
                onClick={submit}
            />

            <Submit
                text="Cancel"
                type={ButtonType.SECONDARY}
                onClick={()=>{setSelectedSetup(null); setShowDeleteModal(false)}}
            />
        </div>
      </Modal>
    )
}

export default DeleteSetupModal