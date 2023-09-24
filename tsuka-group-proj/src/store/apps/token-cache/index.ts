import TokenCacheData from "@/lib/api/token-cache";
import { TokenCache } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface TokenCacheState {
  value: Array<TokenCache>;
  status: "ok" | "loading" | "failed";
}

const initialState: TokenCacheState = {
  value: [] as Array<TokenCache>,
  status: "ok",
};

export const getAllTokenCache = createAsyncThunk("tokencache/get", async () => {
        const res = await TokenCacheData.getAllTokenName();
        console.log("RES",res);
        return res;
    }
);

export const AllTokenCacheSlice = createSlice({
  name: "tokenCacheData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTokenCache.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllTokenCache.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(getAllTokenCache.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default AllTokenCacheSlice.reducer;
