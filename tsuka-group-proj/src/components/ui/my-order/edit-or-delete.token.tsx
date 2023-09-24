import { FiEdit2, FiTrash } from "react-icons/fi";
import {useState, useRef, useEffect} from 'react';
import { OrderStatusEnum } from "@/types/token-order.type";

export interface EditOrDeleteTokenProp {
  setShowEditOrDelete: (a: any) => void;
  setShowConfirmDlg: (a: any) => void;
  setShowEditOrderModal: (a: any) => void;
  status:string;
}
export const EditOrDeleteToken: React.FC<EditOrDeleteTokenProp> = ({
  setShowEditOrDelete,
  setShowConfirmDlg,
  setShowEditOrderModal,
  status,
}) => {
  // useEffect(() => {setShowEditOrDeleteBg(false)})

  const PopupClickHandler = () => {
    setShowEditOrDelete(false);
    setShowEditOrderModal(true);
  };
  const ref = useRef<HTMLDivElement>(null);
  const [clickedInside, setClickedInside] = useState(false);
  const onOutsideClick = () => {
    setShowEditOrDelete(false)
  };
  useEffect(() => {
    const handleClick = (event:any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setClickedInside(false);
        onOutsideClick();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [onOutsideClick]);

  const handleClickInside = (event:any) => {
    setClickedInside(true);
  };

  return (
    <div ref={ref} className="absolute z-40 top-full right-0 w-[176px] border border-[#343C4F] rounded-2xl p-4 bg-tsuka-500 shadow-[0px_20px_64px_rgba(0,0,0,0.4)]" onClick={handleClickInside}>
      <div
        className="flex justify-between items-center text-tsuka-50 text-lg cursor-pointer"
        onClick={() => {
          setShowEditOrDelete(false);
          setShowEditOrderModal(true);
        }}
      >
        <span>Edit</span>
        <FiEdit2 className="text-tsuka-300" />
      </div>
      {status !== OrderStatusEnum.CANCELLED && <hr className="my-3 border-tsuka-400" />}
      {status !== OrderStatusEnum.CANCELLED && <div
        className="flex justify-between items-center text-custom-red text-lg cursor-pointer"
        onClick={() => {
          setShowEditOrDelete(false);
          setShowConfirmDlg(true);
        }}
      >
        <span>Cancel</span>
        <FiTrash />
      </div>}
      {/* <div
        className="absolute left-0 top-0 z-30 bg-white/50 w-screen h-screen pointer-events-none"
        onClick={() => {setShowEditOrDelete(false)}}
      /> */}
    </div>
  );
};
