export type Pool = {
  id: string;
  pool: {
    totalLiq: {
      value: number;
      unit: string;
    };
    dayVolume: {
      value: number;
      unit: string;
    };
    marketCap: {
      value: number;
      unit: string;
    };
    circSupply: {
      value: number;
      unit: string;
      code: string;
    };
    totalMarketCap: {
      value: number;
      unit: string;
    };
    totalSupply: {
      value: number;
      unit: string;
      code: string;
    };
    holders: {
      value: number;
      unit: string;
    };
    totalTx: {
      value: number;
      unit: string;
    };
  };
};
