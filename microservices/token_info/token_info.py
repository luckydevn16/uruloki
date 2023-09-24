import time
import sqlalchemy
from sqlalchemy.sql import text
from sqlalchemy.dialects.mysql import insert, dialect
import requests
import json
import pandas
import numpy
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

import logging

logging.basicConfig(format='%(asctime)s - %(message)s', level=logging.INFO)
logging.info('Script Started')

load_dotenv()

# Set Env Variable
TIMERANGE = os.getenv("TOP_GAINERS_TIME_RANGE")
URL = "https://graphql.bitquery.io"
API_KEY = os.getenv("BITQUERY_APIKEY")
TXCOUNTLIMIT = os.getenv("MINTXCOUNT")
SCHEDULE = os.getenv("SCHEDULE")


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
    table_token_cache = sqlalchemy.Table(
        'token_cache', metadata, autoload_with=connengine)
    table_top_movers = sqlalchemy.Table(
        'top_movers', metadata, autoload_with=connengine)
    table_top_gainers = sqlalchemy.Table(
        'top_gainers', metadata, autoload_with=connengine)

    logging.info("Connection to database succesffull")
    pass
except Exception as e:
    pass
    print(e)
    logging.error("unable to connect with database")
    logging.error("shutting down")
    exit(0)

STABLECOINS = ["WETH", "USDC", "USDT", "-", "WBTC", "DAI"]


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
        'X-API-KEY': API_KEY
    }

    try:
        response = requests.request("POST", URL, headers=headers, data=payload)
        res = json.loads(response.text)

        # prices in usdt
        return pandas.json_normalize(res['data']['ethereum'], 'dexTrades')
    except:
        logging.error("unable to fetch prices from bitquery")

    return None


# configure request time range
def get_top_gainers() -> pandas.DataFrame | None:

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
        "dateFormat": "%Y-%m-%dT%H:%M:%S"
    }

    payload = json.dumps({
        "query": "query ($network: EthereumNetwork!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {\n  ethereum(network: $network) {\n    dexTrades(\n      options: {desc: \"count\", limit: $limit, offset: $offset}\n      date: {since: $from, till: $till}\n      buyCurrency: {notIn: [\"0x6B175474E89094C44Da98b954EedeAC495271d0F\", \"0xdAC17F958D2ee523a2206206994597C13D831ec7\", \"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2\", \"0x2260fac5e5542a773aa44fbcfedf7c193bc2c599\", \"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"]}\n    ) {\n      sellCurrency {\n        symbol\n        name\n        address\n      }\n      buyCurrency {\n        symbol\n        name\n        address\n      }\n      count\n      latest_price: maximum(of: block, get: price)\n      earliest_price: minimum(of: block, get: price)\n      volumeUSD: tradeAmount(in: USD)\n      smartContract {\n        address {\n          address\n        }\n      }\n    }\n  }\n}\n",
        "variables": params
    })
    headers = {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY
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

        data_frame = main_data_frame.query(
            'count > {}'.format(TXCOUNTLIMIT)).copy()
        data_frame = data_frame[data_frame["sellCurrency.symbol"].isin(
            STABLECOINS)]

        # price movement is now percentage
        data_frame['price_movement'] = (
            (data_frame['latest_price'] - data_frame['earliest_price']) / (data_frame['earliest_price']))*100

        # convert price to USDT
        uniqueTokens = data_frame["sellCurrency.address"].unique().tolist()
        df_usdt_prices = convert_prices_to_usdt(uniqueTokens)

        if type(df_usdt_prices) == type(None):
            return None

        # sort based on price and return
        mergedPD = pandas.merge_ordered(data_frame, df_usdt_prices, how="left",
                                        left_on="sellCurrency.address", right_on="buyCurrency.address")

        mergedPD['last_price'] = pandas.to_numeric(mergedPD['last_price'])
        # mergedPD["price_movement_USD"] = mergedPD["price_movement"]
        # mergedPD["last_price"]

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
            "price_movement": "change_24hr"
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
        return dbdf
    except Exception as e:
        print(e)
        logging.error("unable to fetch data from bitquery")
        logging.debug(e)
        return None


def update_token_data():
    while True:
        logging.info("Attempting to update database")
        try:
            dbdf = get_top_gainers()

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

                try:
                    connection.execute(table_top_gainers.delete())
                    connection.execute(table_top_movers.delete())
                except:
                    logging.error(
                        "unable to delete historical data in top_mover/top_gainers")

                try:
                    connection.execute(text("INSERT INTO top_movers(token_cache_id,`rank`) SELECT id, rank() over(order by abs(change_24hr) desc ) from token_cache limit 100;")
                                       )
                    logging.info("succcessfully updated top_movers table")
                except Exception as e:
                    print(e)
                    logging.error(
                        "unable to to insert data in top_movers table")

                try:
                    connection.execute(text(
                        "INSERT INTO top_gainers(token_cache_id,`rank`) SELECT id, rank() over(order by change_24hr desc) from token_cache limit 100;"))
                    logging.info("succcessfully updated top_gainers table")
                except Exception as e:
                    print(e)
                    logging.error(
                        "unable to to insert data in top_gainerstable")
                
                try:
                    connection.close()
                except:
                    pass

        except:
            logging.error("something went wrong while updating results")

        logging.info("sleeping zzzzzzzzzzzzzz...")
        time.sleep(int(SCHEDULE))


update_token_data()
