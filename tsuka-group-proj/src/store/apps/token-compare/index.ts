import { compareTokenData } from "@/@fake-data/compare-token.fake-data";
import { Compare } from "@/types/compare.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface TokenCompareState {
  value: Array<Compare>;
  status: "ok" | "loading" | "failed";
}

const initialState: TokenCompareState = {
  value: [] as Array<Compare>,
  status: "ok",
};

export const getTokenCompare = createAsyncThunk(
  "tokenCompare/get",
  async (code: string): Promise<Array<Compare>> => {
    const data = compareTokenData.filter(
      (item) => item.inputToken.code === code
    );
    return data;
  }
);

export const tokenCompareSlice = createSlice({
  name: "tokenCompare",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTokenCompare.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTokenCompare.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(getTokenCompare.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default tokenCompareSlice.reducer;
