import { useState, useRef, useEffect } from "react";
// import { deleteOrder } from "@/store/apps/user-order";
// import { useAppDispatch } from "@/store/hooks";
import Orders from "@/lib/api/orders";
import { useUrulokiAPI } from "@/blockchain";
import { toast } from "react-toastify";

export interface DeleteConfirmTokenProp {
  setShowConfirmDlg: (a: any) => void;
  setShowDeletedAlert: (a: any) => void;
  deleteID: number;
}

export const DeleteConfirmToken: React.FC<DeleteConfirmTokenProp> = ({
  setShowConfirmDlg,
  setShowDeletedAlert,
  deleteID,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [clickedInside, setClickedInside] = useState(false);
  const onOutsideClick = () => {
    setShowConfirmDlg(false);
  };
  const { cancelOrder } = useUrulokiAPI();
  useEffect(() => {
    const handleClick = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setClickedInside(false);
        onOutsideClick();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onOutsideClick]);

  const handleClickInside = (event: any) => {
    setClickedInside(true);
  };
  // const dispatch = useAppDispatch();

  return (
    <div
      ref={ref}
      className="absolute z-40 right-0 top-full w-[176px] border border-[#343C4F] rounded-2xl p-4 bg-tsuka-500 shadow-[0px_20px_64px_rgba(0,0,0,0.4)]"
      onClick={handleClickInside}
    >
      <p className="text-center text-tsuka-50 text-lg font-medium">
        Are you sure to cancel?
      </p>
      <hr className="my-3 border-tsuka-400" />
      <div
        className="py-[8px] text-custom-primary text-sm text-center bg-tsuka-400 rounded-md cursor-pointer"
        onClick={() => {
          setShowConfirmDlg(false);
        }}
      >
        No
      </div>
      <div
        className="mt-2 py-[8px] text-custom-red text-sm text-center bg-tsuka-400 rounded-md cursor-pointer"
        onClick={async () => {
          setShowConfirmDlg(false);
          // dispatch(deleteOrder(deleteID))
          Orders.cancelOrder(deleteID);
          cancelOrder(deleteID).then((res) => {
            if (res?.msg === "success") {
              toast(res?.msg, { type: "success" });
            } else {
              toast(res?.msg, { type: "error" });
            }
            setShowDeletedAlert(true);
          });
        }}
      >
        Cancel
      </div>
    </div>
  );
};
