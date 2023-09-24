use std::{collections::HashMap};

use gql_client::{Client, GraphQLError};
use serde::Serialize;
use serde_json::Value;

use self::queries::top_gainers;

mod queries;

pub struct QueryBuilder {
    query: String,
    variables: HashMap<String, String>,
    query_type: QueryType
}

pub enum QueryType {
    None,
    TopGainers,
    TopMovers
}

#[derive(Serialize, Debug)]
pub struct TopGainersVariables {
    limit: u32,
    offset: u32,
    network: String,
    since: String,
    till: String,
    dateFormat: String
}

impl QueryBuilder {
    pub fn new() -> Self {
        Self {
            query: String::new(),
            variables: HashMap::new(),
            query_type: QueryType::TopGainers
        }
    }

    pub fn set_query(mut self, query: QueryType) -> QueryBuilder {
        match query {
            QueryType::TopGainers => {
                let query = top_gainers::query();
                self.query = query;
                self.query_type = QueryType::TopGainers;
            },
            QueryType::TopMovers => {
                //let query = fs::read_to_string("src/query_builder/top_movers.gql").unwrap();
                //self.query = query;
            },
            QueryType::None => {}
        }

        return self;
    }

    pub fn set_variable(mut self, key: String, value: String) -> QueryBuilder {
        self.variables.insert(key, value);
        return self;
    }

    pub async fn run(&self, client: Client) -> Result<Value, GraphQLError> {
        let mut result: Result<Option<Value>, GraphQLError> = Ok(None);

        match self.query_type {
            QueryType::TopGainers => {
                let variables = TopGainersVariables {
                    limit: self.variables.get("limit").unwrap().parse::<u32>().unwrap(),
                    offset: self.variables.get("offset").unwrap().parse::<u32>().unwrap(),
                    network: self.variables.get("network").unwrap().to_string(),
                    since: self.variables.get("since").unwrap().to_string(),
                    till: self.variables.get("till").unwrap().to_string(),
                    dateFormat: self.variables.get("dateFormat").unwrap().to_string()
                };

                result = client.query_with_vars::<Value, TopGainersVariables>(self.query.as_str(), variables).await;
            },
            QueryType::TopMovers => {
                
            },
            QueryType::None => {
                
            }
        }

        let data = match result {
            Ok(result) => result,
            Err(e) => return Err(e.into()),
        };
        
        Ok(data.unwrap())
    }
}