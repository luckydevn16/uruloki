import { tokenPositionsData } from "@/@fake-data/token-positions.fake-data";
import { TokenPositions } from "@/types/token-positions.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface TokenPositionState {
  value: TokenPositions;
  status: "ok" | "loading" | "failed";
}

const initialState: TokenPositionState = {
  value: {} as TokenPositions,
  status: "ok",
};

export const getTokenPosition = createAsyncThunk(
  "tokenPosition/get",
  async (id: string): Promise<TokenPositions> => {
    const data = tokenPositionsData.find((item) => item.id === id)!;
    return data;
  }
);

export const tokenPositionSlice = createSlice({
  name: "tokenPosition",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTokenPosition.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTokenPosition.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(getTokenPosition.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default tokenPositionSlice.reducer;
