import { CardType } from "@/types/card.type";
import { gql } from "graphql-request";

const BITQUERY_API_ENDPOINT = "https://graphql.bitquery.io/";
const BITQUERY_API_KEY = process.env.NEXT_PUBLIC_BITQUERY_API_KEY as string;

type BitqueryBalancesResponseToken = {
  currency: {
    symbol: string;
    name: string;
    address: string;
  };
  value: number;
};

export const getTokensInWallet = async (
  walletAddress: string
): Promise<Array<CardType> | null> => {
  let query = gql`
    {
        ethereum {
          address(address: {is: "${walletAddress}"}) {
            balances {
              currency {
                symbol
                name
                address
              }
              value
            }
          }
        }
      }
    `;

  let response = await fetch(BITQUERY_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": BITQUERY_API_KEY,
    },
    body: JSON.stringify({
      query: query,
    }),
  });

  const { data } = await response.json();
  if (!data.ethereum.address[0].balances) return null;
  const balances = data.ethereum.address[0].balances.filter(
    (a: { value: number }) => a.value > 0
  ) as BitqueryBalancesResponseToken[];
  let result: CardType[] = [];
  let i = 0;
  balances.forEach((tokenBalance) => {
    if (
      result.filter((a) => a.shortName == tokenBalance.currency.symbol).length >
      1
    ) {
      let existingValue = result.filter(
        (a) => a.shortName == tokenBalance.currency.symbol
      )[0];
      if (tokenBalance.value > existingValue.amount) {
        existingValue = {
          id: existingValue.id,
          value: "0",
          amount: tokenBalance.value,
          name: tokenBalance.currency.name,
          shortName: tokenBalance.currency.symbol,
          address: tokenBalance.currency.address,
        };
      }
    } else {
      if (
        !isScamToken(tokenBalance.currency.symbol) ||
        !isScamToken(tokenBalance.currency.name)
      ) {
        result.push({
          id: i++,
          value: tokenBalance.value.toLocaleString(),
          amount: tokenBalance.value,
          name: tokenBalance.currency.name,
          shortName: tokenBalance.currency.symbol,
          address: tokenBalance.currency.address,
        });
      }
    }
  });

  return result;
};

const isScamToken = (tokenName: string): boolean => {
  if (tokenName.includes("...") || tokenName.includes(".com")) return true;
  return false;
};
