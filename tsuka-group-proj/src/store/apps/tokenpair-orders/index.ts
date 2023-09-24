import Orders from "@/lib/api/orders";
import { Order } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface TokenpairOrders {
  value: { pair_address: string; orders: Order[] };
  status: "ok" | "loading" | "failed";
}

const initialState: TokenpairOrders = {
  value: {
    pair_address: "",
    orders: [] as Order[],
  },
  status: "ok",
};

export const getActiveOrdersbyTokenPair = createAsyncThunk(
  "tokens/getActiveOrders",
  async ({
    pair_address,
    walletAddress,
  }: {
    pair_address: string;
    walletAddress: string;
  }) => {
    const orders = await Orders.getActiveOrdersbyTokenPair({
      tokenpair: pair_address,
      walletAddress,
    });
    return {
      pair_address,
      orders,
    };
  }
);

export const tokenpairOrders = createSlice({
  name: "tokenPairOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getActiveOrdersbyTokenPair.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getActiveOrdersbyTokenPair.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(getActiveOrdersbyTokenPair.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default tokenpairOrders.reducer;
