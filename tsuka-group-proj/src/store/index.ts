import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import poolInfoSlice from "./apps/pool-info";
import strategiesSlice from "./apps/strategies";
import strategyDetailsSlice from "./apps/strategy-details";
import tokenSlice from "./apps/token";
import tokenCompareSlice from "./apps/token-compare";
import tokenHistoryPositionSlice from "./apps/token-history-positions";
import tokenPositionSlice from "./apps/token-positions";
import userOrderSlice from "./apps/user-order";
import tokenOrderBooksSlice from "./apps/token-order-books";
import homePageTokenSlice from "./apps/tokens";
import bitquerySlice from "./apps/bitquery-data";
import AllTokenCacheSlice from "./apps/token-cache";
import TokenpairOrders from "./apps/tokenpair-orders";
import TokenPairInfo from "./apps/tokenpair-info";

export const store = configureStore({
  reducer: {
    poolInfo: poolInfoSlice,
    token: tokenSlice,
    tokenCompare: tokenCompareSlice,
    tokenPosition: tokenPositionSlice,
    tokenOrderBooks: tokenOrderBooksSlice,
    tokenHistoryPosition: tokenHistoryPositionSlice,
    userOrder: userOrderSlice,
    homepageTokens: homePageTokenSlice,
    bitquery: bitquerySlice,
    tokencache: AllTokenCacheSlice,
    strategies: strategiesSlice,
    strategyDetails: strategyDetailsSlice,
    tokenpairOrders: TokenpairOrders,
    tokenPairInfo: TokenPairInfo,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
