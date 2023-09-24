import { useState, useEffect } from "react";
import { TokenIconsToken } from "@/components/ui/tokens/token-icons.token";
import { getCards } from "@/@fake-data/card.fake-data";
import { CardType } from "@/types/card.type";
import Chart from "@/components/charts/ReactApexcharts";
import { WithdrawAndDepositModal } from "@/components/ui/profile/modal";
import { getChartData } from "@/@fake-data/chart.fake-data";
import { ChartType } from "@/types/chart.type";

import { useUrulokiAPI } from "@/blockchain";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { orders } from "@prisma/client";
import HomepageTokens from "@/lib/api/tokens";
import { useAccount } from "wagmi";
import { fetchBalance, fetchToken }from "@wagmi/core"
import Orders from "@/lib/api/orders";
import { Order } from "@/types";
import { LoadingBox } from "@/components/ui/loading/loading-box";

type PageProps = {
  tokenBalances: Array<CardType>;
  chartData: ChartType;
  userOrders: orders[];
};

export default function Profile({
  tokenBalances,
  chartData,
}: PageProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [userOrders, setUserOrders] = useState<Order[]>([])
  const [searchValue, setSearchValue] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isDeposit, setIsDeposit] = useState<boolean>(false);
  const [walletTokenAddresses, setWalletTokenAddresses] = useState<string[]>([]);
  const [walletBalances, setWalletBalances] = useState<Array<CardType>>([]);
  const [chartDatas, setChartDatas] = useState<ChartType>({
    active: 0,
    out: 0,
  });

  const { address, isConnected } = useAccount()
  const { addFunds, withdrawFunds } = useUrulokiAPI();

  const handleOpenWidrawModal = () => {
    setShowModal(true);
    setIsDeposit(false);
  };

  const handleOpenDepositModal = () => {
    setIsDeposit(true);
    setShowModal(true);
  };

  async function getUserOrders() {
    if(address) {
      const userOrders = await Orders.getOrdersByWalletAddress(address);
      setUserOrders(userOrders)
    } else {
      toast.error("No wallet connected")
    }
  }

  useEffect(() => {
    getUserOrders()
  }, [address, isConnected])

  const setChartData = () => {
    let active = 0;
    let out = 0;
    userOrders &&
      userOrders.map((ele, id) => {
        if (ele.status === "Active") {
          active++;
        } else if (ele.status === "OutOfFunds") {
          out++;
        }
      });
    setChartDatas({
      active: active,
      out: out,
    });
  };

  useEffect(() => {
    console.log("Setting chart data")
    setChartData();
  }, [address, isConnected, userOrders]);

  async function getTokenBalance(token_address: string, wallet_address: string): Promise<CardType> {
    const balance = await fetchBalance({
      address: address as `0x${string}`,
      token: token_address as `0x${string}`,
    })
    const token_info = await fetchToken({
      address: token_address as `0x${string}`,
    })
    
    return{
      id: 0, //Not sure what this field is for
      address: token_address,
      amount: parseFloat(balance.formatted),
      value: parseFloat(balance.formatted) >= 0.01 ? parseFloat(balance.formatted).toLocaleString("en-us", {minimumFractionDigits: 2}) : parseFloat(balance.formatted) == 0 ? "0" : parseFloat(balance.formatted).toFixed(8),
      name: token_info.name,
      shortName: balance.symbol
    }
  }

  async function getBalances() {
    if(!address) return

    let token_data_promises = walletTokenAddresses.map(address => {
      return getTokenBalance(address, address)
    })

    try {
      const temp_balances = await Promise.all(token_data_promises)
      setWalletBalances(temp_balances.sort((a,b) => b.amount - a.amount))
    } catch (e) {
      toast.error("Unable to fetch token balances. Please try again later.")
    }

    setLoading(false)
  }

  useEffect(() => {
    getBalances()
  }, [walletTokenAddresses])

  useEffect(() => {
    console.log("Address:")
    console.log(address)
    if (!address) return;
    (async () => {
      try {
        const tokensInWallet = await HomepageTokens.getTokensWithPotentialBalance(
          address
        );
        setWalletTokenAddresses(tokensInWallet);
      } catch (err) {
        console.log("Potential Tokens Error: ", err);
      }
    })();
  }, [address, isConnected]);

  const backgroundInfo = [
    {
      color: "#4BDB4B",
      backgroundImage: "url('/imgs/b_15.svg')",
    },
    {
      color: "#E6007A",
      backgroundImage: "url('/imgs/b_10.svg')",
    },
    {
      color: "#F7931A",
      backgroundImage: "url('/imgs/b_13.svg')",
    },
    {
      color: "#282D35",
      backgroundImage: "url('/imgs/b_12.svg')",
    },
    {
      color: "#8A06D4",
      backgroundImage: "url('/imgs/b_2.svg')",
    },
    {
      color: "#E84142",
      backgroundImage: "url('/imgs/b_11.svg')",
    },
    {
      color: "#211F6D",
      backgroundImage: "url('/imgs/b_14.svg')",
    },
    {
      color: "#C2A633",
      backgroundImage: "url('/imgs/b_5.svg')",
    },
    {
      color: "#000000",
      backgroundImage: "url('/imgs/b_3.svg')",
    },
    {
      color: "#0033AD",
      backgroundImage: "url('/imgs/b_1.svg')",
    },
    {
      color: "#13B5EC",
      backgroundImage: "url('/imgs/b_8.svg')",
    },
    {
      color: "#00EF8B",
      backgroundImage: "url('/imgs/b_4.svg')",
    },
    {
      color: "#6747ED",
      backgroundImage: "url('/imgs/b_9.svg')",
    },
    {
      color: "#1B295E",
      backgroundImage: "url('/imgs/b_7.svg')",
    },
    {
      color: "#000000",
      backgroundImage: "url('/imgs/b_3.svg')",
    },
    {
      color: "#474DFF",
      backgroundImage: "url('/imgs/b_16.svg')",
    },
  ];

  const handleSearchValue = (e: any) => {
    setSearchValue(e.target.value);
  };

  const getBackgroundIndex = (token_name: string) => {
    const asciiKeys = [];
    var totalIndex = 0;
    var index = 0;
    for (var i = 0; i < token_name.length; i++) {
      asciiKeys.push(token_name[i].charCodeAt(0));

      totalIndex += asciiKeys[i];
      index = totalIndex % backgroundInfo.length;
    }
    return index;
  };

  const handleDepositWithdraw = (index: number) => {
    if (!walletBalances[index]) {
      toast.error("Wallet is not connected!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } else {
      const { address, amount } = walletBalances[index];
      if (isDeposit) {
        if (address) {
          addFunds(address, amount).then((res) => {
            if (res?.msg === "success") {
              toast(res?.msg, { type: "success" });
            } else {
              toast(res?.msg, { type: "error" });
            }
            setShowModal(false);
          });
        }
      } else {
        if (address) {
          withdrawFunds(address, amount).then((res) => {
            if (res?.msg === "success") {
              toast(res?.msg, { type: "success" });
            } else {
              toast(res?.msg, { type: "error" });
            }
            setShowModal(false);
          });
        }
      }
    }
  };

  return (
    <>
      {loading && (
        <LoadingBox
          title="Loading data"
          description="Please wait patiently as we process your transaction, ensuring it is secure and reliable."
        />
      )}
      <div className="relative px-4 md:px-10 pt-3 md:pt-10 pb-8">
        <div className="flex justify-between w-full items-center text-tsuka-50">
          <div className="hidden md:block font-Poppins-300 font-medium text-[40px] leading-[60px] ">
            Profile Overview
          </div>
        </div>
        <div className="w-full md:flex pt-[32px] flex-row-reverse	">
          <div className="flex flex-col md:ml-[21px] ">
            <button
              className="text-center py-[11px] px-[123px] font-medium font-['DM Sans'] text-[18.9px] leading-[25px] text-[#FFFFFF] bg-[#6FCF97]  rounded-md"
              onClick={handleOpenDepositModal}
            >
              Deposit
            </button>
            <button
              className="text-center py-[11px] px-[123px] font-medium font-['DM Sans'] text-[18.9px] leading-[25px] text-[#FFFFFF] bg-[#EB5757] hover:bg-[#EB1727] rounded-md my-[11px]"
              onClick={handleOpenWidrawModal}
            >
              Withdraw
            </button>
            <Chart data={chartDatas} />
          </div>
          <div className="w-full flex flex-col items-center">
            <div className="w-full grid gap-3 lg:grid-cols-3 mb-[40px] xl:grid-cols-4 md:grid-cols-2">
              {walletBalances?.map((card: CardType, key: number) => (
                <div
                  key={card.id}
                  className="flex justify-between py-[16px] px-[16px] rounded-md items-center gap-[27px] bg-no-repeat bg-cover	"
                  style={{
                    color: "#FFFFFF",
                    backgroundColor:
                      backgroundInfo[getBackgroundIndex(card.name)].color,
                    backgroundImage:
                      backgroundInfo[getBackgroundIndex(card.name)]
                        ?.backgroundImage,
                  }}
                >
                  <TokenIconsToken
                    name={card.name}
                    shortName={card.shortName}
                    width={60}
                    height={60}
                  ></TokenIconsToken>
                  <div className="flex  font-medium text-[18.9px] landing-[25px] font-['DM Sans'] ">
                    <span>{card.value}</span>
                  </div>
                  <div className="flex  font-medium text-[18.9px] landing-[25px] font-['DM Sans'] ">
                    <span>{card.shortName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <WithdrawAndDepositModal
          open={showModal}
          handleClose={() => setShowModal(false)}
          callback={handleDepositWithdraw}
          Cards={walletBalances}
          walletBalances={walletBalances}
          isDeposit={isDeposit}
          backgroundInfo={backgroundInfo}
        />
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const getCardsData = await getCards();
  const chartData = await getChartData();
  //const tokensInWallet = await getTokensInWallet("0x28Dc1b43ebCd1A0A0B5AB1E25Fac0b82551207ef")

  // Pass data to the page via props
  return {
    props: {
      tokenBalances: getCardsData,
      chartData: chartData,
    },
  };
}