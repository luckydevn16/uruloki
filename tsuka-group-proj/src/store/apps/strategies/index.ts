import Strategies from "@/lib/api/strategies";
import { Strategy } from "@/types/strategy.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface StrategiesState {
  value: Array<Strategy>;
  status: "ok" | "loading" | "failed";
}

const initialState: StrategiesState = {
  value: [] as Array<Strategy>,
  status: "ok",
};

export const getStrategies = createAsyncThunk(
  "strategies/getAll",
  async (walletAddress: string): Promise<Array<Strategy>> => {
    const data = await Strategies.getStrategiesData(walletAddress);
    return data;
  }
);

export const getStrategy = createAsyncThunk(
  "strategies/get",
  async (id: string): Promise<Strategy> => {
    const data = await Strategies.getStrategyData(id);
    return data;
  }
);

export const strategiesSlice = createSlice({
  name: "strategies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStrategies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getStrategies.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(getStrategies.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getStrategy.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getStrategy.fulfilled, (state, action) => {
        state.status = "ok";
        const index = state.value.findIndex(
          ({ id }) => id === action.payload.id
        );
        state.value.splice(index, 1, action.payload);
      })
      .addCase(getStrategy.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default strategiesSlice.reducer;
