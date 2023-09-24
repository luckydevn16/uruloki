import time
import sqlalchemy
from sqlalchemy.sql import text
from sqlalchemy.dialects.mysql import insert,dialect
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
    logging.info("Connection to database succesffull")
    pass
except Exception as e:
    pass
    print(e)
    logging.error("unable to connect with database")
    logging.error("shutting down")
    exit(0)



while True:
    try:
        logging.info("attempting prune")
        connection = connengine.connect()
        res = connection.execute(text("delete from token_cache where id not in (select token_cache_id from most_buy_orders) and token_cache.id not in (select token_cache_id from most_sell_orders) and token_cache.id not in (select token_cache_id from top_movers) and token_cache.id not in (select token_cache_id from top_gainers);"))
        logging.info("prune successfull")
        connection.close()
    except:
        logging.error("prune failed")

    logging.info("sleeping zzzzzzzzzzzzzz...")
    time.sleep(int(SCHEDULE))

    
