import { poolInfoData } from "@/@fake-data/pool-info.fake-data";
import { Pool } from "@/types/pool.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface PoolState {
  value: Pool;
  status: "ok" | "loading" | "failed";
}

const initialState: PoolState = {
  value: {} as Pool,
  status: "ok",
};

export const getPoolInfo = createAsyncThunk(
  "poolInfo/get",
  async (id: string): Promise<Pool> => {
    const data = poolInfoData.find((item) => item.id === id)!;
    return data;
  }
);

export const poolInfoSlice = createSlice({
  name: "poolInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPoolInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPoolInfo.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(getPoolInfo.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default poolInfoSlice.reducer;
