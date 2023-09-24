import { MdClose } from "react-icons/md";

interface Props {
  title: string;
  onClose: (arg: { success: boolean }) => void;
}

/**
 * Provides a title & close button for modals
 * @param title The title to display
 * @param onClose A function which is called when the close button is clicked
 * @returns
 */
const ModalHeader: React.FC<Props> = ({ title, onClose }) => {
  return (
    <div className="flex flex-row justify-between mb-10">
      <p className="text-2xl font-semibold text-[#BBC3D7]">{title}</p>
      <MdClose
        onClick={() => onClose({ success: false })}
        className="text-white/50 text-3xl cursor-pointer hover:text-white/80 transition-all"
      />
    </div>
  );
};

export default ModalHeader;
