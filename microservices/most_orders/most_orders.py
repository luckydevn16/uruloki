import json
import logging
from datetime import datetime, timedelta
import time
import numpy
import pandas
from sqlalchemy import bindparam, select, cast
from sqlalchemy.sql import text
import sqlalchemy
import requests
import os
from dotenv import load_dotenv


# Load Env Variables
load_dotenv()


logging.basicConfig(format='%(asctime)s - %(message)s', level=logging.INFO)
logging.info('Script Started')


SCHEDULE = os.getenv("SCHEDULE")
API_KEY = os.getenv("ETHERSCAN_APIKEY")
WEI_CONST = 10**18
TIMERANGE = os.getenv("TOP_GAINERS_TIME_RANGE")
URL = "https://graphql.bitquery.io"
BQAPI_KEY = os.getenv("BITQUERY_APIKEY")


# Set Env Variable


try:
    sqlUrl = sqlalchemy.engine.url.URL(
        drivername="mysql+pymysql",
        username=os.getenv("USERNAME"),
        password=os.getenv("PASSWORD"),
        host=os.getenv("HOST"),
        port=3306,
        database=os.getenv("DATABASE"),
        query={"ssl_ca": "/etc/ssl/certs/ca-certificates.crt"},
    )

    connengine = sqlalchemy.create_engine(sqlUrl)
    metadata = sqlalchemy.MetaData()
    most_buy_orders = sqlalchemy.Table(
        'most_buy_orders', metadata, autoload_with=connengine)

    most_sell_orders = sqlalchemy.Table(
        'most_sell_orders', metadata, autoload_with=connengine)

    logging.info("Connection to database succesffull")
    pass
except Exception as e:
    pass
    print(e)
    logging.error("unable to connect with database")
    logging.error("shutting down")
    exit(0)


connection = connengine.connect()

def insert_updates():
    pass
    try:
        # most buys
        connection.execute(text("insert into most_buy_orders(token_cache_id,`rank`) select token_cache.id,_rank from token_cache inner join (select pair_address, dense_rank() over (order by count(order_type) desc) as _rank from orders  where order_type = 'buy' group by orders.pair_address) as y on token_cache.pair_address = y.pair_address limit 100;"))
        logging.info("successfully updated most_buy_orders table")
    except Exception as e:
        print(e)
        logging.error(
            "unable to to insert data in most_buy_orders")

    try:
        # most sells
        connection.execute(text("insert into most_sell_orders(token_cache_id,`rank`) select token_cache.id,_rank from token_cache inner join (select pair_address, dense_rank() over (order by count(order_type) desc) as _rank from orders  where order_type = 'sell' group by orders.pair_address) as y on token_cache.pair_address = y.pair_address limit 100;"))
        logging.info("successfully updated most_sell_orders table")
    except Exception as e:
        print(e)
        logging.error(
            "unable to to insert data in most_sell_orders")

# detect tokens in orders that may not exist in token_cache & update token_cache


def detect_presence():
    pass

    ignore = ["test","tesst"]
    pairs_to_fetch = set()
    try:
        rs = connection.execute(text("select name,token_cache.id,y.pair_address,y._rank from token_cache right join (select pair_address, dense_rank() over (order by count(order_type) desc) as _rank from orders  where order_type = 'buy' group by orders.pair_address limit 100) as y on token_cache.pair_address = y.pair_address where token_cache.id is null;"))
        for row in rs:
            if row[2] not in ignore:
                pairs_to_fetch.add(row[2])

    except:
        pass

    try:
        rs = connection.execute(text("select name,token_cache.id,y.pair_address,y._rank from token_cache right join (select pair_address, dense_rank() over (order by count(order_type) desc) as _rank from orders  where order_type = 'sell' group by orders.pair_address limit 100) as y on token_cache.pair_address = y.pair_address where token_cache.id is null;"))
        for row in rs:
            if row[2] not in ignore:
                pairs_to_fetch.add(row[2])
    except:
        pass
    
    l =  list(pairs_to_fetch)
    return l


def update_MOST_tables():

    # empty table
    try:
        connection.execute(most_buy_orders.delete())
        # empty table
        connection.execute(most_sell_orders.delete())
        logging.info("delete data in most_buy and sell")
    except:
        logging.error(
            "unable to to delete data in most_buy_orders or sell_orders")
        return
    
    insert_updates()


def convert_prices_to_usdt(currencies):
    pass

    params = {
        "network": "ethereum",
        "currencies": currencies,
        "date": datetime.utcnow().strftime("%Y-%m-%d")
    }

    payload = json.dumps({
        "query": "query ($network: EthereumNetwork!, $currencies: [String!], $date: ISO8601DateTime) {\n  ethereum(network: $network) {\n    dexTrades(\n      exchangeName: {is: \"Uniswap\"}\n      buyCurrency: {in: $currencies}\n      sellCurrency: {is: \"0xdac17f958d2ee523a2206206994597c13d831ec7\"}\n      date: {till: $date}\n    ) {\n      buyCurrency {\n        symbol\n        address\n      }\n      last_price: maximum(of: block, get: price)\n    }\n  }\n}\n",
        "variables": params
    })

    headers = {
        'Content-Type': 'application/json',
        'X-API-KEY': BQAPI_KEY
    }

    try:
        response = requests.request("POST", URL, headers=headers, data=payload)
        res = json.loads(response.text)

        # prices in usdt
        return pandas.json_normalize(res['data']['ethereum'], 'dexTrades')
    except:
        logging.error("unable to fetch prices from bitquery")

    return None


def update_missing_data(pair_addresses):
    STABLECOINS = ["WETH", "USDC", "USDT", "-", "WBTC", "DAI"]

    B = datetime.utcnow()
    A = B - timedelta(hours=float(TIMERANGE))
    From = A.strftime("%Y-%m-%dT%H:%M:%S")
    Till = B.strftime("%Y-%m-%dT%H:%M:%S")
    network = "ethereum"
    params = {
        "limit": 10000,
        "offset": 0,
        "network": network,
        "from": From,
        "till": Till,
        "dateFormat": "%Y-%m-%dT%H:%M:%S",
        "pair_addresses":pair_addresses
    }

    payload = json.dumps({
        "query": "query ($network: EthereumNetwork!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime, $pair_addresses: [String!]) {\n  ethereum(network: $network) {\n    dexTrades(\n      options: {desc: \"count\", limit: $limit, offset: $offset}\n      date: {since: $from, till: $till}\n      smartContractAddress: {in: $pair_addresses}\n    ) {\n      sellCurrency {\n        symbol\n        name\n        address\n      }\n      buyCurrency {\n        symbol\n        name\n        address\n      }\n      count\n      latest_price: maximum(of: block, get: price)\n      earliest_price: minimum(of: block, get: price)\n      volumeUSD: tradeAmount(in: USD)\n      smartContract {\n        address {\n          address\n        }\n      }\n    }\n  }\n}\n",
        "variables": params
    })
    headers = {
        'Content-Type': 'application/json',
        'X-API-KEY': BQAPI_KEY
    }

    try:
        response = requests.request("POST", URL, headers=headers, data=payload)
        res = json.loads(response.text)

        main_data_frame = pandas.json_normalize(
            res['data']['ethereum'], 'dexTrades')
        main_data_frame['latest_price'] = pandas.to_numeric(
            main_data_frame['latest_price'])
        main_data_frame['earliest_price'] = pandas.to_numeric(
            main_data_frame['earliest_price'])

        data_frame = main_data_frame.copy()
        data_frame = data_frame[data_frame["sellCurrency.symbol"].isin(
            STABLECOINS)]

        data_frame['price_movement'] = data_frame['latest_price'] - \
            data_frame['earliest_price']

        # convert price to USDT
        uniqueTokens = data_frame["sellCurrency.address"].unique().tolist()
        df_usdt_prices = convert_prices_to_usdt(uniqueTokens)

        if type(df_usdt_prices) == type(None):
            return None

        # sort based on price and return
        mergedPD = pandas.merge_ordered(data_frame, df_usdt_prices, how="left",
                                        left_on="sellCurrency.address", right_on="buyCurrency.address")

        mergedPD['last_price'] = pandas.to_numeric(mergedPD['last_price'])
        mergedPD["price_movement_USD"] = mergedPD["price_movement"] * \
            mergedPD["last_price"]

        # latest price has units (token A ). last_price has units (USD for token B)
        mergedPD["token_price_USD"] = mergedPD["latest_price"] * \
            mergedPD["last_price"]

        # mergedPD = mergedPD.sort_values("price_movement_USD", ascending=False)

        mergedPD.rename(columns={
            "buyCurrency.name": "name",
            "buyCurrency.symbol_x": "short_name",
            "buyCurrency.address_x": "address",
            "buyCurrency.symbol_y": "paired_with_token",
            # "buyCurrency.address_y": "paired_with_token_address",
            "smartContract.address.address": "pair_address",
            "token_price_USD": "price",
            "volumeUSD": "volume",
            "price_movement_USD": "change_24hr"
        }, inplace=True)

        dbdf = mergedPD[["name", "short_name", "address",
                        "pair_address", "price", "volume", "change_24hr", "paired_with_token"]]
        # "pair_name",

        # to remove WETH/WETH
        dbdf = dbdf[dbdf['short_name'] != dbdf['paired_with_token']]

        # create pair name string
        # dbdf["pair_name"] = dbdf["symbol"].astype(
        #     str)+"/"+dbdf["paired_with_token"].astype(str)
        del dbdf["paired_with_token"]

    except Exception as e:
        print(e)
        logging.error("unable to fetch data from bitquery")
        logging.debug(e)
        return None

    try:
        if type(dbdf) != type(None):
            # try:
            dbdf = dbdf.drop_duplicates("pair_address", keep='first')
            dbdf['chain'] = "ethereum"
            dbdf['last_updated'] = datetime.utcnow().strftime("%Y-%m-%d")
            dbdf = dbdf.replace({numpy.NaN: None})
            data_dict = dbdf.to_dict("records")
            connection = connengine.connect()

            logging.info("starting insert")
            statement = text("INSERT INTO token_cache(chain, name ,pair_address, price, change_24hr, volume,last_updated, address, short_name ) VALUES( :chain, :name, :pair_address, :price, :change_24hr, :volume, :last_updated, :address, :short_name ) ON DUPLICATE KEY UPDATE price = token_cache.price, change_24hr = token_cache.change_24hr, volume = token_cache.volume, last_updated = token_cache.last_updated;")
            for line in data_dict:
                connection.execute(statement, line)

            logging.info("Successfully updated database")
    except:
        pass


while True:
    logging.info("Attempting to update database")
    try:
        # update_MOST_tables()
        ls = detect_presence()
        logging.info("Updating data for missing tokens")
        print(ls)

        if len(ls) != 0:
            update_missing_data(ls)

        update_MOST_tables()

    except:
        logging.error("something went wrong while updating results")

    time.sleep(int(SCHEDULE))
    logging.info("sleeping zzzzzzzzzzzzzz...")

