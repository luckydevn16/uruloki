use chrono::{DateTime, Utc};
use gql_client::{Client, ClientConfig};
use serde::Serialize;
use serde_json::{Value};
use std::{time::SystemTime, collections::HashMap};

use crate::query_builder::{QueryBuilder, QueryType};

pub mod query_builder;

#[tokio::main]
async fn main() {
    //After a specified delay:
    // 1. Get list of top gainers by running original graphql query
    // 2. Get updated percent change and price using algorithms from main site
    // 3. Get list of top movers
    // 4. Same
    
    let end = get_timestamp(0);
    let start = get_timestamp(60 * 60 * 24); //Current time minus 24hr

    let query_builder = QueryBuilder::new()
        .set_query(QueryType::TopGainers)
        .set_variable("limit".to_string(), "2".to_string())
        .set_variable("offset".to_string(), "0".to_string())
        .set_variable("network".to_string(), "ethereum".to_string())
        .set_variable("since".to_string(), start)
        .set_variable("till".to_string(), end)
        .set_variable("dateFormat".to_string(), "%Y-%m-%dT%H:%M:%S".to_string());
        
    let client = get_gql_client(120, "BQYGyvosL45fIYQufkHjXo285pURGJGT".to_string());
    let data = query_builder.run(client).await.unwrap();

    //Parse into a vector of Pair structs
    let dex_trades: &Vec<Value> = data.get("ethereum").unwrap().get("dexTrades").unwrap().as_array().unwrap();
    let token_pairs = dex_trades
                                        .iter()
                                        .map(|x| {
                                            let mut temp = Pair {
                                                base_token_address: x.get("buyCurrency").unwrap().get("address").unwrap().to_string(),
                                                base_token_symbol: x.get("buyCurrency").unwrap().get("symbol").unwrap().to_string(),
                                                base_token_name: x.get("buyCurrency").unwrap().get("name").unwrap().to_string(),
                                                quote_token_address: x.get("sellCurrency").unwrap().get("address").unwrap().to_string(),
                                                quote_token_symbol: x.get("sellCurrency").unwrap().get("symbol").unwrap().to_string(),
                                                quote_token_name: x.get("sellCurrency").unwrap().get("name").unwrap().to_string(),
                                                pair_address: x.get("smartContract").unwrap().get("address").unwrap().get("address").unwrap().to_string()
                                            };

                                            temp.set_base_quote();

                                            temp
                                        }).collect::<Vec<Pair>>();
            
    println!("{:#?}", token_pairs);
}

#[derive(Debug, Serialize)]
pub struct Pair {
    base_token_address: String,
    base_token_symbol: String,
    base_token_name: String,

    quote_token_address: String,
    quote_token_symbol: String,
    quote_token_name: String,

    pair_address: String
}

impl Pair {
    fn set_base_quote(&mut self) {
        //Swap the base and quote tokens if the base token is WETH, DAI, USDC, or USDT
        if self.base_token_symbol == "WETH" || self.base_token_symbol == "DAI" || self.base_token_symbol == "USDC" || self.base_token_symbol == "USDT" {
            let temp_symbol = self.base_token_symbol.clone();
            let temp_address = self.base_token_address.clone();
            let temp_name = self.base_token_name.clone();

            self.base_token_symbol = self.quote_token_symbol.clone();
            self.base_token_address = self.quote_token_address.clone();
            self.base_token_name = self.quote_token_name.clone();

            self.quote_token_symbol = temp_symbol;
            self.quote_token_address = temp_address;
            self.quote_token_name = temp_name;
        };
    }
}

/**
 * Returns an ISO8601 timestamp string, with the given delta (in seconds) into the past
 */
fn get_timestamp(delta_secs: u64) -> String {
    if delta_secs == 0 {
        let t = SystemTime::now();
        let t: DateTime<Utc> = t.into();
        return t.to_rfc3339().split("+").collect::<Vec<&str>>()[0].to_string();
    } else {
        let t = SystemTime::now() - std::time::Duration::from_secs(delta_secs);
        let t: DateTime<Utc> = t.into();
        return t.to_rfc3339().split("+").collect::<Vec<&str>>()[0].to_string();
    }
}

fn get_gql_client(timeout: u64, key: String) -> Client {
    let endpoint = "https://graphql.bitquery.io";
    let mut headers = HashMap::new();

    headers.insert("Content-Type".to_string(), "application/json".to_string());
    headers.insert("X-API-KEY".to_string(), key);

    let client = Client::new_with_config(ClientConfig{
        endpoint: endpoint.to_string(),
        headers: Some(headers),
        timeout: Some(timeout),
        proxy: None
    });
    
    client
}