import { strategiesData } from "@/@fake-data/strategies.fake-data";
import { Strategy } from "@/types/strategy.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface StrategyDetailsState {
  value: Strategy;
  status: "ok" | "loading" | "failed";
}

const initialState: StrategyDetailsState = {
  value: {} as Strategy,
  status: "ok",
};

export const getStrategyDetails = createAsyncThunk(
  "strategyDetails/get",
  async (id: string): Promise<Strategy> => {
    console.log("this is detail id", id)
    const data = strategiesData.find((item) => item.id === id)!;
    return data;
  }
);
export const strategyDetailsSlice = createSlice({
  name: "strategyDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStrategyDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getStrategyDetails.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(getStrategyDetails.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default strategyDetailsSlice.reducer;
