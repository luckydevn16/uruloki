export const getLiveDexTrades = (
  baseAddress: string
): { query: string } => {
  console.log('pressed');
  console.log(baseAddress);
  return {
    query: `
    subscription {
      EVM(network: eth) {
        DEXTrades(
          where: {Trade: {Buy: {Currency: {SmartContract: {is: "${baseAddress}"}}}}}
        ) {
          Trade {
            Sell {
              Currency {
                Symbol
                SmartContract
              }
              Price
              Amount
            }
          }
          Trade {
            Buy { 
              Currency {
                Symbol
                SmartContract
              }
              Price
              Amount
            }
          }
        }
      }
    }
    `,
  };
};

export default getLiveDexTrades;
