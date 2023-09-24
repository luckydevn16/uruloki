import { Strategy } from "@/types"
import SetupsTableRow from "./table-row"
import { useState } from "react"
import DeleteSetupModal from "@/components/ui/modal/delete-setup-modal"

interface Props {
    strategies: Array<Strategy>
    onLoad: () => void
}

const Table: React.FC<Props> = ({strategies, onLoad}) => {
    const [selectedSetup, setSelectedSetup] = useState<Strategy | null>(null)
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

    return (
        <>
            <table className="overflow-auto w-full">
                <thead className="text-sm text-left font-normal text-tsuka-300 border-b border-tsuka-400">
                    <tr>
                    <th scope="col" className="px-4 py-2">
                    </th>
                    <th scope="col" className="px-4 py-2">
                        Setup Title
                    </th>
                    <th scope="col" className="px-4 py-2 flex w-full">
                        <span>Tokens</span>
                        <span className="ml-auto mr-8 min-w-[128px]">Status</span>
                    </th>
                    <th scope="col" className="px-4 py-2">
                        Created on
                    </th>
                    <th className="px-4 py-2" />
                    </tr>
                </thead>
                <tbody className="">
                    {strategies?.map((item, index) => (
                        <SetupsTableRow
                            key={index}
                            setup={item}
                            setSelectedSetup={setSelectedSetup}
                            showDeleteModal={()=>setShowDeleteModal(true)}
                        />
                    ))}
                </tbody>
            </table>
            {showDeleteModal && selectedSetup && (
                <DeleteSetupModal
                    selectedSetup={selectedSetup}
                    setSelectedSetup={setSelectedSetup}
                    setShowDeleteModal={setShowDeleteModal}
                    refresh={onLoad}
                />
            )}
        </>
        
    )
}

export default Table