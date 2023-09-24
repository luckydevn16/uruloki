import Image from "next/image";
import Link from "next/link";
import { FiX } from "react-icons/fi";
import { commafy } from "@/helpers/calc.helper";
import { INotificationsTokenProps } from "@/global";
import { Fragment } from "react";

export const Notifications: React.FC<INotificationsTokenProps> = ({
  notifications,
  closeNotification,
}) => {
  return (
    <div className="absolute top-14 z-20 right-0 md:right-[195px] w-full md:w-[440px] px-4 md:px-0">
      <div className="relative bg-tsuka-500 px-4 md:px-6 pt-6 text-tsuka-300 rounded-2xl shadow-[0px_28px_64px_rgba(0,0,0,0.4)] overflow-hidden">
        <div className="flex justify-between">
          <span className="text-tsuka-50 text-[18px] font-medium">Notifications</span>
          <FiX className="-mr-2 md:-mr-4 -mt-4 cursor-pointer text-xl" onClick={closeNotification} />
        </div>
        <div className="mt-8 h-[282px] pr-1 pb-6 overflow-auto scrollable">
          {
            notifications[0] ?
              <Link href={"#"} >
                <div className="flex items-center gap-3">
                  <Image src="/icons/notifyIcon.png" width={40} height={40} alt="notify" />
                  <p className="grow">
                    <span className="text-tsuka-100 font-normal">{`Order to ${notifications[0].buy ? "buy" : "sell"} `}</span>
                    <span className="text-tsuka-50 font-medium">{`${notifications[0].amount} ${notifications[0].asset}`}</span>
                    <span className="text-tsuka-100 font-normal">{` executed at `}</span>
                    <span className="text-tsuka-50 font-medium">{`$${notifications[0].executedAt}`}</span>
                  </p>
                </div>
              </Link>
            :
              <p className="text-center text-tsuka-100 font-normal">No notifications</p>
          }
          {
            notifications.map((notification, idx) => {
              return (
                <Fragment key={idx}>
                  <div className="w-full border-b border-tsuka-400 my-5"></div>
                  <Link href={"#"} >
                    <div className="flex items-center gap-3">
                      <Image src="/icons/notifyIcon.png" width={40} height={40} alt="notify" />
                      <p className="grow">
                        <span className="text-tsuka-100 font-normal">{`Order to ${notification.buy ? "buy" : "sell"} `}</span>
                        <span className="text-tsuka-50 font-medium">{`${notification.amount} ${notification.asset}`}</span>
                        <span className="text-tsuka-100 font-normal">{` executed at `}</span>
                        <span className="text-tsuka-50 font-medium">{`$${notification.executedAt}`}</span>
                      </p>
                    </div>
                  </Link>
                </Fragment>
              )
            })
          }
        </div>
        <div className="absolute bottom-0 left-0 w-full h-10 z-30 bg-gradient-to-b from-[rgb(31,35,51,0)] to-[rgb(31,35,51,0.8)]"></div>
      </div>
    </div>
  );
};
