import Image from "next/image";
import { FiX } from "react-icons/fi";

export interface DeletedAlertTokenProp {
  setShowDeletedAlert: (a: any) => void;
}

export const DeletedAlertToken: React.FC<DeletedAlertTokenProp> = ({
  setShowDeletedAlert,
}) => {
  return (
    <div
      className="fixed left-0 bottom-0 z-30 bg-gradient-to-t from-[#13151F] to-transparent w-full py-4 lg:py-8 flex justify-center items-center"
    >
      <div className="relative bg-tsuka-500 rounded-2xl p-5 pr-7 flex items-center mx-6">
        <Image src="/icons/alert.png" alt="alter" width={40} height={40} />
        <div className="ml-3">
          <p className="text-tsuka-100 text-lg">
            You just deleted order{" "}
            <span className="text-tsuka-50">
              {"ANCH"} with {"PLKD"}
            </span>
            .
          </p>
          <p className="text-sm text-tsuka-200">
            Clicked by mistake?{" "}
            <span
              className="text-custom-primary cursor-pointer"
              onClick={() => setShowDeletedAlert(false)}
            >
              undo
            </span>
          </p>
        </div>
        <FiX
          className="static md:absolute top-3 right-3 ml-2 md:ml-0 text-2xl md:text-base text-tsuka-300 font-medium cursor-pointer"
          onClick={() => setShowDeletedAlert(false)}
        />
      </div>
    </div>
  );
};
