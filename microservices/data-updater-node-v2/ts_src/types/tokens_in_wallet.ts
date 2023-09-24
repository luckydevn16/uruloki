import { CardType } from "./card.type"
import { ChartType } from "./chart.type";

export type TokensInWallet = {
    tokenBalances: Array<CardType> | undefined;
    chartData: ChartType | undefined;
    walletBalances: Array<CardType>;
}