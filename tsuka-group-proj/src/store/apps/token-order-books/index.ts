import Orders from "@/lib/api/orders";
import { TokenOrderBooks } from "@/types/token-order-books.type";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface TokenOrderBooksState {
  value: TokenOrderBooks;
  status: "ok" | "loading" | "failed";
}

const initialState: TokenOrderBooksState = {
  value: {} as TokenOrderBooks,
  status: "ok",
};

export const getTokenOrderBooks = createAsyncThunk(
  "tokenOrderBook/get",
  async (pair_address: string): Promise<TokenOrderBooks> => {
    const tokenOrderBooksData: TokenOrderBooks = await Orders.getOrderBooks(
      pair_address
    );
    return { ...tokenOrderBooksData };
  }
);

export const tokenOrderBooksSlice = createSlice({
  name: "tokenOrderBook",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTokenOrderBooks.fulfilled, (state, action) => {
      state.value = action.payload;
    });
  },
});

export default tokenOrderBooksSlice.reducer;
