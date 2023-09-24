import json
import logging
from datetime import datetime, timedelta
import time
from sqlalchemy import bindparam, select, cast
from sqlalchemy.sql import text
import sqlalchemy
import requests
import os
from dotenv import load_dotenv
dict_cache = dict()
contract_addresses = []


def request_cache(address):
    global dict_cache
    return dict_cache.get(address)


# Load Env Variables
load_dotenv()


logging.basicConfig(format='%(asctime)s - %(message)s', level=logging.INFO)
logging.info('Script Started')


SCHEDULE = os.getenv("SCHEDULE")
API_KEY = os.getenv("ETHERSCAN_APIKEY")
BITQKEY = os.getenv("BITQUERY_APIKEY")
WEI_CONST = 10**18
TIMERANGE = os.getenv("TOP_GAINERS_TIME_RANGE")

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
    table_token_cache = sqlalchemy.Table(
        'token_cache', metadata, autoload_with=connengine)

    top_gainers = sqlalchemy.Table(
        'top_gainers', metadata, autoload_with=connengine)

    logging.info("Connection to database succesffull")
    pass
except Exception as e:
    pass
    print(e)
    logging.error("unable to connect with database")
    logging.error("shutting down")
    exit(0)


def fetch_market_cap(contract_address, price_usd: float):

    try:
        url = f'https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress={contract_address}&apikey={API_KEY}'

        circulating_supply = request_cache(contract_address)

        if circulating_supply == None:
            response = requests.get(url)
            data = response.json()
            if data['status'] == '1':
                circulating_supply = float(data['result']) / WEI_CONST
                dict_cache[contract_address] = circulating_supply

        market_cap = circulating_supply * price_usd

        return market_cap
    except:
        return None


def update_market_caps():

    last_updated = datetime.utcnow().strftime("%Y-%m-%d")
    global contract_addresses
    try:
        logging.info("attempting to get token_data")
        connection = connengine.connect()
        stmt = select(table_token_cache.c.address, cast(
            table_token_cache.c.price, sqlalchemy.Float), table_token_cache.c.pair_address)
        # incase join
        # .select_from(table_token_cache).join(top_gainers, table_token_cache.c.id == top_gainers.c.token_cache_id)
        contract_addresses = [row for row in connection.execute(stmt)]
        logging.info("token data fetch successfully")
    except:
        logging.error("failed to fetch token_data.... exiting")
        return

    results = []
    try:
        logging.info('fetching circulating supply')
        for res in contract_addresses:
            if res[1] != None:
                mp = fetch_market_cap(res[0], res[1])
                if mp != None:
                    obj = {"_pair_address": res[2], "_market_cap": int(
                        mp), "_last_updated": last_updated}
                    results.append(obj)

        logging.info('circulating supply received')

    except Exception as e:
        pass
        logging.error("failed to fetch circulating   supply      .... exiting")
        return

    try:
        logging.info('attempting to update database')
        stmt = table_token_cache.update().\
            where(table_token_cache.c.pair_address == bindparam('_pair_address')).\
            values({
                'market_cap': bindparam('_market_cap'),
                'last_updated': bindparam("_last_updated")
            })
        connection.execute(stmt, results)
        logging.info("database updated succesfully")

    except Exception as e:
        pass
        print("failed 2 update database  : {}".format(e))
        logging.info("database failed")

    connection.close()
    return


while True:
    logging.info("Attempting to update database")
    try:
        update_market_caps()
    except Exception as e:
        logging.error("something went wrong while updating results")
        print(e)

    time.sleep(int(SCHEDULE))
    logging.info("sleeping zzzzzzzzzzzzzz...")
