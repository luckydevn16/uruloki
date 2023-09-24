import {
  G_QUERY_GetQuotePrice,
  G_QUERY_GetTokenPair,
} from "../g_queries";
import { TokenPriceInPair } from "../types";

export const getTokenPrice = async ( 
  pair_address: string,
  yesterday: boolean = false
): Promise<TokenPriceInPair> => {
  const timeBefore = (
    yesterday
      ? new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      : new Date()
  ).toISOString();
  if(!pair_address) {
    console.log("token-price.ts: No pair address provided")
    return {
      base_price: 0,
      quote_price: 0
    }
  }
 
  //Query bitquery
  const tokenPairResponse = await G_QUERY_GetTokenPair(pair_address);

  //Return 0 if pair is not found
  if (!tokenPairResponse?.data?.data?.ethereum?.dexTrades[0]) {
    return { base_price: 0, quote_price: 0 };
  }

  //Get token addresses from pair
  const {
    token0: { address: token0Address },
    token1: { address: token1Address },
  } = tokenPairResponse?.data?.data?.ethereum?.dexTrades[0];
  let tokenAddress, pairedTokenAddress;

  //Determine the token & paired token
  if (
    [
      process.env.WETH_ADDR,
      process.env.DAI_ADDR,
      process.env.USDT_ADDR,
      process.env.USDC_ADDR,
    ].includes(String(token0Address).toLowerCase())
  ) {
    tokenAddress = token1Address;
    pairedTokenAddress = token0Address;
  } else {
    tokenAddress = token0Address;
    pairedTokenAddress = token1Address;
  }

  //Get the price of the token
  const quotePriceResponse = await G_QUERY_GetQuotePrice(
    tokenAddress,
    pairedTokenAddress,
    timeBefore
  );

  //If no trades are found
  if (!quotePriceResponse || quotePriceResponse?.data?.data?.ethereum?.dexTrades == null || quotePriceResponse?.data?.data?.ethereum?.dexTrades?.length == 0) {
    return { base_price: 0, quote_price: 0 };
  }
  
  const { quotePrice: basePrice } = quotePriceResponse?.data?.data?.ethereum?.dexTrades[0];

  //If the paired tokens address is weth or dai (so not a stablecoin)
  if (
    String(pairedTokenAddress).toLowerCase() === process.env.WETH_ADDR ||
    String(pairedTokenAddress).toLowerCase() === process.env.DAI_ADDR
  ) {
    const baseQuotePrice = basePrice;
    const baseCurrency = pairedTokenAddress;

    const quoteCurrency =
      pairedTokenAddress === process.env.WETH_ADDR
        ? process.env.USDC_ADDR
        : process.env.USDT_ADDR;

    const baseQuotePriceResponse = await G_QUERY_GetQuotePrice(
      baseCurrency,
      quoteCurrency as string,
      timeBefore
    );
    if (!baseQuotePriceResponse.data.data.ethereum.dexTrades[0]) {
      return { base_price: 0, quote_price: 0 };
    }
    const { quotePrice: quoteQuotePrice } =
      baseQuotePriceResponse.data.data.ethereum.dexTrades[0];

    return {
      base_price: baseQuotePrice * quoteQuotePrice,
      quote_price: quoteQuotePrice as number,
    };
  }
  return { base_price: basePrice, quote_price: 1 };
};
