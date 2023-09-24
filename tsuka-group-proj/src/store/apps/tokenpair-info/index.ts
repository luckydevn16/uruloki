import HomePageTokens from "@/lib/api/tokens";
import { TokenPairInfo } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface TokenPairInfoState {
  value: TokenPairInfo;
  status: string;
}

const initialState: TokenPairInfoState = {
  value: {
    baseToken: {
      name: "",
      symbol: "",
      address: "",
    },
    pairedToken: {
      name: "",
      symbol: "",
      address: "",
    },
  },
  status: "ok",
};

export const getTokenPairInfo = createAsyncThunk(
  "tokens/tokenPairInfo",
  async (pair_address: string) => {
    console.log("getTokenPairInfo = createAsyncThunk",pair_address)
    return await HomePageTokens.getTokenPairInfo(pair_address);
  }
);

export const tokePairInfoSlice = createSlice({
  name: "homePageTokens",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTokenPairInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTokenPairInfo.fulfilled, (state, action) => {
        console.log("getTokenPairInfo.action.payload",action.payload)
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(getTokenPairInfo.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default tokePairInfoSlice.reducer;
