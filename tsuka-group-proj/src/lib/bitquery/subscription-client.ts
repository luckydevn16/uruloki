import { SubscriptionClient } from "subscriptions-transport-ws";
import { env } from "process";
// const token = "BQYhGqHd1MptOvjXeIUPAQ1L24huNj1l"; // get your auth token from somewhere
const BITQUERY_API_KEY = process.env.NEXT_PUBLIC_BITQUERY_API_KEY;

// const GRAPHQL_ENDPOINT = 'wss://streaming.bitquery.io/graphql';
let GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_SUBSCRIPTIN_ENDPOINT;
const webSocketImpl =
  typeof window !== "undefined" ? window.WebSocket : require("ws");
 
// Create the socket client to connect Bitquery
export const createSubscriptionClient = () => {
  //console.log("URL", GRAPHQL_ENDPOINT);
  if (typeof GRAPHQL_ENDPOINT == "undefined") {
    GRAPHQL_ENDPOINT = "wss://streaming.bitquery.io/graphql";
  }
  const client = new SubscriptionClient(
    GRAPHQL_ENDPOINT,
    {
      reconnect: true,
      connectionParams: {
        headers: {
          Authorization: `Bearer ${BITQUERY_API_KEY}`,
        },
      },
    },
    webSocketImpl
  );

  client.onError((error) => {
    //console.log('WebSocket Error: ', error);
  });
  
  client.onDisconnected(() => {
    //console.log('WebSocket Disconnected');
  });
  
  return client;
};
