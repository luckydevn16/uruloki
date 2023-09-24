import { HeaderMenuButton } from "@/components/ui/buttons/header-menu.button";
import { HeaderNotificationButton } from "@/components/ui/buttons/header-notification.button";
import { EditOrderToken } from "@/components/ui/my-order/edit-order.token";
import { Notifications } from "@/components/ui/tokens/notifications.token";
import { INotification } from "@/global";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { DefaultButton } from "../ui/buttons/default.button";
import { HeaderLinkButton } from "../ui/buttons/header-link.button";

import { fetchTestnet } from "@/helpers/fetch-testnet";
import { Web3Button } from "@web3modal/react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { HiOutlineArrowLongLeft } from "react-icons/hi2";
import { SidebarStrategies } from "../strategies/sidebar.strategies";
import Strategies from "@/lib/api/strategies";
import { Strategy } from "@/types";
import { getConnectedAddress } from "@/helpers/web3Modal";

export const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const [showNotify, setShowNotify] = useState<boolean>(false);
  const [showEditOrderModal, setShowEditOrderModal] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [providerUrl, setProviderUrl] = useState(
    process.env.PROVIDER_TESTNET_URL as string
  );

  const [network, setNetwork] = useState("");
  const [setups, setSetups] = useState<Array<Strategy>>([]);

  const handleChainChanged = async (chainId: any) => {
    setNetwork(chainId);
    const { provider } = await fetchTestnet({ chainId, providerUrl });

    // TODO new methods with provider
  };

  const switchToEthereum = async () => {
    try {
      await window.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1" }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError?.code === 4902) {
        try {
          await window.ethereum?.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x1",
                chainName: "ETH",
                rpcUrls: ["https://eth.llamarpc.com"],
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  };

  // useEffects
  useEffect(() => {
    if (network && network !== "0x1") {
      switchToEthereum();
    }
  }, [network]);

  useEffect(() => {
    if (window.ethereum !== undefined) {
      window?.ethereum?.on?.("chainChanged", handleChainChanged);
    }

    const load = async () => {
      const address = await getConnectedAddress();
      if (address) {
        const tempSetups = await Strategies.getStrategiesData(address);
        setSetups(tempSetups);
      }
    };
    load();
  }, []);

  const router = useRouter();

  const navLinks = [
    {
      title: "Homepage",
      path: "/homepage",
    },
    {
      title: "Orders & Setups",
      path: "/my-orders",
    },
    {
      title: "Profile",
      path: "/profile",
    },
  ];

  let notifications: INotification[] = [
    {
      buy: true,
      amount: 1.8493004,
      asset: "ETH",
      executedAt: 45.23,
    },
    {
      buy: false,
      amount: 5.5393054,
      asset: "ETH",
      executedAt: 605.04,
    },
    {
      buy: true,
      amount: 2.8453044,
      asset: "ETH",
      executedAt: 403.244,
    },
    {
      buy: true,
      amount: 1.8493004,
      asset: "ETH",
      executedAt: 45.23,
    },
    {
      buy: true,
      amount: 2.8453044,
      asset: "ETH",
      executedAt: 403.244,
    },
  ];

  return (
    <>
      <Head>
        <title>Uruloki</title>
        <meta name="description" content="Uruloki" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <nav>
          <div className="w-full px-2 md:px-6 lg:px-8 border-b border-tsuka-500 relative overflow-hidden">
            <Image
              className="absolute top-0 left-0"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to right, rgba(0,0,0,1) 90%, rgba(0,0,0,0))",
              }}
              src="/imgs/sky.jfif"
              width={700}
              height={200}
              alt="header bgImg sky"
            />
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center md:justify-start">
                <div className="flex flex-shrink-0 items-center pl-2 xs:px-4 md:px-2">
                  <div className="text-xl font-extrabold text-tsuka-100 ">
                    <div className="flex justify-between items-center">
                      <Link href="/">
                        <Image
                          className="hidden sm:block"
                          src="/logos/logo_icon.png"
                          alt="logo__image"
                          width={40}
                          height={40}
                          style={{ position: "relative" }}
                        />
                      </Link>
                      <div
                        className="px-3 flex flex-col hidden sm:block"
                        style={{ position: "relative" }}
                      >
                        <span className="text-[26px] tracking-widest font-Uruloki text-white stroke-transparent">
                          URULOKI
                        </span>
                      </div>
                    </div>
                    <Image
                      className="sm:hidden"
                      src="/logos/logo_icon.png"
                      alt="logo"
                      width={40}
                      height={40}
                    />
                  </div>
                </div>
                <div className="hidden lg:ml-6 lg:block">
                  <div className="flex px-10 space-x-4">
                    {navLinks?.map(({ path, title }, index) => {
                      let isActive = path === router.pathname;
                      if (
                        index === 1 &&
                        router.pathname.indexOf("strategies") >= 0
                      ) {
                        isActive = true;
                      }

                      return (
                        <HeaderLinkButton
                          key={path}
                          path={path}
                          title={title}
                          active={isActive}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex flex-row-reverse md:flex-row items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
                <HeaderMenuButton
                  menuCollapsed={menuCollapsed}
                  callback={() => setMenuCollapsed(!menuCollapsed)}
                />
                {/*
                <HeaderNotificationButton
                  callback={() => console.log("NotificationButton click")}
                  showNotify={showNotify}
                  setShowNotify={setShowNotify}
                />
              */}
                <div className="hidden sm:block">
                  <ConnectButton />
                </div>
              </div>
            </div>
          </div>
          {/* Mobile menu, show/hide based on menu state. */}
          {!menuCollapsed && (
            <div className="lg:hidden" id="mobile-menu">
              <div className="absolute z-20 w-full bg-tsuka-500 space-y-1 px-4 pb-3 pt-2 shadow-lg shadow-tsuka-700 flex flex-col">
                {navLinks?.map(({ path, title }, idx) => (
                  <div
                    className={`flex justify-center${
                      idx > 0 ? " border-t border-t-tsuka-400" : ""
                    }`}
                    key={idx}
                  >
                    <HeaderLinkButton
                      key={path}
                      path={path}
                      title={title}
                      active={path === router.pathname}
                    />
                  </div>
                ))}
                <div className="mx-auto">
                  <ConnectButton />
                </div>
                <DefaultButton
                  label="Create an Order"
                  callback={() => setShowEditOrderModal(true)}
                  filled={true}
                  Icon={FiPlusCircle}
                  enabled={true}
                />
              </div>
            </div>
          )}
          {showNotify && (
            <Notifications
              notifications={notifications}
              closeNotification={() => setShowNotify(false)}
            />
          )}
        </nav>
        <div className="">{children}</div>
        <div className="fixed z-10 bottom-4 right-4 bg-tsuka-300 text-tsuka-50 rounded-full text-sm font-normal whitespace-nowrap">
          <button
            type="button"
            onClick={() => setShowSidebar(true)}
            className="w-full text-center focus:outline-none rounded-full text-sm p-4 inline-flex justify-center items-center mr-2"
          >
            <label className="mr-2">
              <HiOutlineArrowLongLeft size={24} />
            </label>
            Orders & Setups
          </button>
        </div>
        <SidebarStrategies
          open={showSidebar}
          handleOpen={() => setShowSidebar(false)}
        />
      </main>
    </>
  );
};
