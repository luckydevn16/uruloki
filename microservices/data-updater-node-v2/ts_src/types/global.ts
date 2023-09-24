export interface ITopGainersTokenProps {
  topGainers: ITopGainer[]
}

export interface IMostBuyOrdersTokenProps {
  mostBuyOrders: IMostBuyOrder[]
}

export interface IMostSellOrdersTokenProps {
  mostSellOrders: IMostSellOrder[]
}

export interface ITopMoversTokenProps {
  topMovers: ITopMover[]
}

export interface INotificationsTokenProps {
  notifications: INotification[];
  closeNotification: () => void;
}


export interface ITopGainer {
  rank: number;
  token: {
    id: string;
    name: string;
    shortName: string;
    pair_address: string;
  };
  price: number;
  risingPercent: number;
}

export interface IMostBuyOrder {
  rank: number;
  token: {
    id: string;
    name: string;
    shortName: string;
    pair_address: string;
  };
  buyOrders: number;
}

export interface IMostSellOrder {
  rank: number;
  token: {
    id: string;
    name: string;
    shortName: string;
    pair_address: string;
  };
  sellOrders: number;
}

export interface ITopMover {
  id: number;
  token: string;
  chain: {
    id: string;
    name: string;
    shortName: string;
  };
  price: number;
  risingPercent: number;
  volume: number;
  marketCap: number;
  orderCount: number;
  buyOrderCount: number;
  sellOrderCount: number;
  pair_address: String;
}

export interface INotification {
  buy: boolean;   //true: Buy, false: Sell
  amount: number;
  asset: string;
  executedAt: number;
}
