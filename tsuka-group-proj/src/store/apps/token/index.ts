import { tokensData } from "@/@fake-data/token.fake-data";
import Orders from "@/lib/api/orders";
import HomePageTokens from "@/lib/api/tokens";
import { RootState } from "@/store";
import { Token } from "@/types/token.type";
import { TokenPriceInPair } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { TokenPriceInPair, getTokenPriceInPair } from "../user-order";

export interface TokenState {
  value: Token;
  status: "ok" | "loading" | "failed";
}

const initialState: TokenState = {
  value: {
    id: "",
    token: "Ethereum",
    chain: {
      name: "Ethereum",
      code: "ETH",
      address: "",
    },
    pair: {
      code: "BTC",
      name: "Bitcoin",
      address: "",
    },
    price: {
      value: 0,
      operator: "+",
      variationValue: 0,
      variationValueDiference: 0,
    },
    volume: {
      value: 0,
      currencyLabel: "",
    },
    marketCap: {
      value: "0",
      currencyLabel: "",
    },
    nOrders: {
      value: "0",
      currencyLabel: "",
    },
    orderSplit: {
      buy: 0,
      sell: 0,
    },
  } as Token,
  status: "ok",
};

export const getToken = createAsyncThunk(
  "token/get",
  async (id: string): Promise<Token> => {
    const data = tokensData.find((item) => item.id === id)!;
    return data;
  }
);

export const getTokenByStrategyId = createAsyncThunk(
  "token/getByStrategyId",
  async (id: string): Promise<Token> => {
    const data = tokensData.find((item) => item?.strategy_id === id)!;
    return data;
  }
);

export const setOrderSplit = createAsyncThunk(
  "token/setOrderSplit",
  async (
    Param: {
      orderSplit: {
        buy: number;
        sell: number;
      };
    },
    { getState }
  ): Promise<any> => {
    const previousState = (getState() as RootState).token;
    const data = {
      ...previousState.value,
      orderSplit: {
        buy: Param.orderSplit.buy,
        sell: Param.orderSplit.sell,
      },
    };
    return data;
  }
);

export const getTokenVolume = createAsyncThunk(
  "token/getTokenVolume",
  async (baseTokenAddress: string): Promise<{ tradeAmount: number }> => {
    const tokenVolume = await HomePageTokens.getTokenVolume(baseTokenAddress);
    return tokenVolume;
  }
);

export const getYesterdayTokenPairPrice = createAsyncThunk(
  "tokenPairPrice/getYesterdayPrice",
  async (pair_address: string): Promise<number> => {
    const data = Orders.getYesterdayTokenPriceInPair(pair_address);
    return data;
  }
);

export const setPairAddress = createAsyncThunk(
  "token/setPairAddress",
  async (pair: string, { getState }): Promise<any> => {
    const previousState = (getState() as RootState).token;
    const data = {
      ...previousState.value,
      pair: {
        ...previousState.value.pair,
        address: pair,
      },
    };
    return data;
  }
);

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getToken.fulfilled, (state, action) => {
        state.status = "ok";
        // state.value = action.payload;
      })
      .addCase(getToken.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getTokenByStrategyId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTokenByStrategyId.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(getTokenByStrategyId.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(setOrderSplit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(setOrderSplit.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(setOrderSplit.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(setPairAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(setPairAddress.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(setPairAddress.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getTokenVolume.fulfilled, (state, action) => {
        // state.value.volume.value = action.payload.tradeAmount;
        const MILLION = 1e6,
          BILLION = 1e9,
          TRILLION = 1e12;
        if (action.payload.tradeAmount > TRILLION) {
          state.value.volume.value = action.payload.tradeAmount / TRILLION;
          state.value.volume.currencyLabel = "Trillion";
        } else if (action.payload.tradeAmount > BILLION) {
          state.value.volume.value = Number(
            (action.payload.tradeAmount / BILLION).toString().slice(0, 4)
          );
          state.value.volume.currencyLabel = "Billion";
        } else if (action.payload.tradeAmount > MILLION) {
          state.value.volume.value = Number(
            (action.payload.tradeAmount / MILLION).toString().slice(0, 4)
          );
          state.value.volume.currencyLabel = "Million";
        } else {
          state.value.volume.value = action.payload.tradeAmount;
          state.value.volume.currencyLabel = "";
        }
      })
      .addCase(getYesterdayTokenPairPrice.fulfilled, (state, action) => {
        console.log("getYesterdayTokenPairPrice fulfilled", action.payload);
        state.value.price.variationValue = action.payload;
      });
    // .addCase(getTokenPriceInPair.fulfilled, (state, action) => {
    //   state.value.price.value = action.payload.base_price.toLocaleString();
    // });
  },
});

export default tokenSlice.reducer;
