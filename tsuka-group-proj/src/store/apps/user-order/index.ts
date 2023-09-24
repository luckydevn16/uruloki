import { userOrder } from "@/@fake-data/user-order.fake-data";
import { getConnectedAddress } from "@/helpers/web3Modal";
import Orders from "@/lib/api/orders";
import { Order, PatchOrder, PostOrder } from "@/types";
import { UserOrder } from "@/types/token-order.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TokenPriceInPair } from "@/types";

export interface UserOrderState {
  selectedOrder: Order;
  selectedTokenPairPrice: number;
  value: UserOrder[];
  status: "ok" | "loading" | "failed";
}

const initialState: UserOrderState = {
  selectedOrder: {} as Order,
  selectedTokenPairPrice: 0,
  value: [] as UserOrder[],
  status: "ok",
};

export const setSelectedOrder = createAsyncThunk(
  "userOrder/select",
  async (order_id: number): Promise<Order> => {
    if (order_id == -1) {
      return {} as Order;
    }
    const data = await Orders.getOrderById(order_id);
    return data;
  }
);

interface updateEditOrderParams {
  id: number;
  patchData: PatchOrder;
  walletAddress: string;
}

export const getTokenPairPrice = createAsyncThunk(
  "tokenPairPrice/get",
  async (pair_address: string): Promise<number> => {
    const data = Orders.getTokenPriceInPair(pair_address);
    return data;
  }
);
export const editUserOrder = createAsyncThunk<
  unknown,
  updateEditOrderParams,
  { dispatch: any }
>("userOrder/post", async ({ id, patchData, walletAddress }, { dispatch }) => {
  // const data = userOrder.find((item) => item.id === id)!;
  const data = await Orders.editOrder(id, patchData);
  
  const user_id = 1;
  if (data) {
    dispatch(getUserOrder(user_id.toString()))
    dispatch(
      getUserOrderWithFilter({ id: user_id, status: "Open", search: "", walletAddress })
    );
  }

});

interface getUserOrderWithFilterParams {
  id: number;
  status: string;
  search: string;
  walletAddress: string;
}
export const getUserOrderWithFilter = createAsyncThunk<
  UserOrder[],
  getUserOrderWithFilterParams,
  { dispatch: any }
>(
  "userOrder/getwithfilter",
  async ({ id, status, search, walletAddress }): Promise<UserOrder[]> => {
    // const data = userOrder.find((item) => item.id === id)!;
    const data = await Orders.getOrdersbyUserIdandFilters(
      id,
      status,
      search,
      walletAddress
    );
    return data;
  }
);
export const getUserOrder = createAsyncThunk(
  "userOrder/get",
  async (id: string) => {
    // const data = userOrder.find((item) => item.id === id)!;
    const data = await Orders.getOrdersbyUserId(id);
    return data;
  }
);
export const createOrder = createAsyncThunk(
  "userOrder/set",
  async (postData: PostOrder, { dispatch, rejectWithValue }) => {
    console.log("post lib::");
    try {
      const data = await Orders.createOrder(postData);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const deleteOrder = createAsyncThunk(
  "userOrder/delete",
  async (id: number, { dispatch }) => {
    const data = undefined
    // await Orders.deleteOrder(id);\
    if (data) {
      const address = await getConnectedAddress();
      if(address) {
        dispatch(
          getUserOrderWithFilter({
            id: 1,
            status: "Open",
            search: "",
            walletAddress: address,
          })
        );
      }
    }
    return data;
  }
);

export const userOrderSlice = createSlice({
  name: "userOrder",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserOrder.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(getUserOrder.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getUserOrderWithFilter.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserOrderWithFilter.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(getUserOrderWithFilter.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(setSelectedOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(setSelectedOrder.fulfilled, (state, action) => {
        state.status = "ok";
        state.selectedOrder = action.payload;
      })
      .addCase(setSelectedOrder.rejected, (state) => {
        state.status = "failed";
      })
  },
});

export default userOrderSlice.reducer;
