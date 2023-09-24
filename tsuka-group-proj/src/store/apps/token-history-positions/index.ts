import { tokenPositionsData } from "@/@fake-data/token-positions.fake-data";
import { splitAddress } from "@/helpers/splitAddress.helper";
import { OrderBookPosition } from "@/types/token-positions.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface TokenHistoryPositionState {
  value: Array<OrderBookPosition>;
  status: "ok" | "loading" | "failed";
}

const initialState: TokenHistoryPositionState = {
  value: [] as Array<OrderBookPosition>,
  status: "ok",
};

export const getTokenHistoryPosition = createAsyncThunk(
  "tokenHistoryPosition/get",
  async (id: string): Promise<Array<OrderBookPosition>> => {
    const data = tokenPositionsData.find((item) => item.id === id)!;

    const filteredData = [
      ...data.buy.positions.map((item) => {
        return {
          ...item,
          address: splitAddress(item.address),
        };
      }),
      ...data.sell.positions.map((item) => {
        return {
          ...item,
          address: splitAddress(item.address),
        };
      }),
    ].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    return filteredData;
  }
);

export const tokenHistoryPositionSlice = createSlice({
  name: "tokenHistoryPosition",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTokenHistoryPosition.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTokenHistoryPosition.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(getTokenHistoryPosition.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default tokenHistoryPositionSlice.reducer;
