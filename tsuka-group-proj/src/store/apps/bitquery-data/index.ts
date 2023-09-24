import { BitqueryData } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getBitqueryOHLCData } from "@/lib/bitquery/getBitqueryOHLCData";
import {
  getBitqueryStreamData,
  transformData,
  transformStreamData,
  getAddData,
} from "@/lib/bitquery/getBitqueryStreamData";
import { number } from "joi";
import { store } from "@/store";

export interface BitqueryDataState {
  value: BitqueryData[];
  streamValue: BitqueryData[];
  forwardTime: any;
  candleStickTime: number;
  status: "ok" | "loading" | "failed";
}

const initialState: BitqueryDataState = {
  value: [] as BitqueryData[],
  streamValue: [] as BitqueryData[],
  forwardTime: {} as any,
  candleStickTime: 15 as number,
  status: "ok",
};
// After fetching the historical data and then fetch the subscription data
// Send the data to the Store
export const getBitqueryInitInfo = createAsyncThunk(
  "bitqueryInitInfo/get",
  async (eachAddress: any, { dispatch }): Promise<any> => {
    const responsData = await getBitqueryOHLCData(eachAddress);
    console.log("responsData", responsData);
    const tranData = await transformData(responsData);
    console.log("responsData", tranData);
    const time = 15;
    dispatch(setCandleStick(eachAddress.time));
    dispatch(getBitqueryStreamInfo(eachAddress.pairAddress));
    return tranData;
  }
);
// set the candleStick in the Store
export const setCandleStick = createAsyncThunk(
  "canddleStic/set",
  async (time: any, { dispatch }): Promise<any> => {
    return time;
  }
);
// initialize the historical data in the Store
export const initBitqueryData = createAsyncThunk(
  "bitqueryInitInfo/delete",
  async (any, { dispatch }): Promise<any> => {
    return [];
  }
);
// initialize the sunscription data in the Store
export const initBitqueryStreamData = createAsyncThunk(
  "bitqueryStreamInfo/delete",
  async (any, { dispatch }): Promise<any> => {
    return [];
  }
);
// fetch the subscription data from the Bitquery
export const getBitqueryStreamInfo = createAsyncThunk(
  "bitqueryStreamInfo/get",
  async (pairAddress: any): Promise<any> => {
    const responsData = await getBitqueryStreamData(pairAddress);
    const compareTokenName =
      store.getState().tokenPairInfo.value.baseToken?.symbol;

    const tranData = await transformStreamData(responsData, compareTokenName);
  }
);

export const getBitqueryStream = createAsyncThunk<any, any>(
  "bitqueryStream/get",
  async (tranData): Promise<any> => {
    return tranData;
  }
);

export const bitquerySlice = createSlice({
  name: "bitqueryInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBitqueryInitInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBitqueryInitInfo.fulfilled, (state, action) => {
        state.status = "ok";
        console.log("action.py", action.payload);
        // state.value = [...state.value, ...action.payload];
        state.value = action.payload;
        state.forwardTime =
          action.payload[action.payload.length - 1]?.time + 15 * 60 * 1000;
      })
      .addCase(getBitqueryInitInfo.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(initBitqueryData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initBitqueryData.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(initBitqueryData.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(setCandleStick.pending, (state) => {
        state.status = "loading";
      })
      .addCase(setCandleStick.fulfilled, (state, action) => {
        state.status = "ok";
        console.log(action.payload);
        state.candleStickTime = action.payload;
      })
      .addCase(setCandleStick.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(initBitqueryStreamData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initBitqueryStreamData.fulfilled, (state, action) => {
        state.status = "ok";
        state.streamValue = action.payload;
      })
      .addCase(initBitqueryStreamData.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getBitqueryStreamInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBitqueryStreamInfo.fulfilled, (state, action) => {
        state.status = "ok";
        state.streamValue = action.payload;
        // state.value = action.payload;
      })
      .addCase(getBitqueryStreamInfo.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getBitqueryStream.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBitqueryStream.fulfilled, (state, action) => {
        state.status = "ok";
        let temp = action.payload;
        // temp.time = state.forwardTime;
        state.streamValue = [...state.streamValue, temp];
        console.log("state.candleStickTime*60*1000", state.candleStickTime);
        if (action.payload.time > state.forwardTime) {
          state.forwardTime =
            state.forwardTime + state.candleStickTime * 60 * 1000;
          if (
            action.payload.time >
            state.forwardTime + state.candleStickTime * 60 * 1000
          ) {
            // state.value = [...state.value, ...action.payload];
          } else {
            // const addData = getAddData(state.forwardTime, state.streamValue);
            // state.value = [...state.value, addData];
          }
        }
      })
      .addCase(getBitqueryStream.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default bitquerySlice.reducer;
