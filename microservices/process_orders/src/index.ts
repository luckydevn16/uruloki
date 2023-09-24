import { ethers } from 'ethers';
import axios from 'axios';

import { dbconnect, connection } from './mysql'
import { provider } from './blockchain/providers'
import Abis from './blockchain/Abis.json'

require('dotenv').config();

const maxLength = 200;

const PRIVATEKEY = process.env.PRIVATEKEY || "";

const contractAddress = process.env.CONTRACT_ADDRESS || "0x3c7Bd6C284ADC50AD193333064B66a1D90025a08";

const signer = new ethers.Wallet(PRIVATEKEY, provider);
const contract = new ethers.Contract(contractAddress, Abis.contract, signer);

// ExecutedOneTimeOrder event listener
contract.on("ExecutedOneTimeOrder", (orderId, isBuy, pairAmount, tokenAmount, price, event)=>{
    console.log('ExecutedOneTimeOrder orderId = ', orderId.toNumber());
    
    update_order(orderId.toNumber());
})

// ExecutedContinuousOrder event listener
contract.on("ExecutedContinuousOrder", (orderId, isBuy, price, event)=>{
    console.log('ExecutedContinuousOrder orderId = ', orderId.toNumber());
    
    update_order(orderId.toNumber());
})

// Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Process Order function
const process_orders = async (order_ids: string[]) => {
	try {
        // Run Contract
        const tx = await contract.processOrders(order_ids);
        await tx.wait()

        return 'done';
    } catch (err) {
        console.log('process_orders = ', err);

        return 'done';
    }
}

// Update order status to 'Completed' on database
const update_order = async (order_id: any) => {
    try {
        connection.query(`update orders set status = 'Completed' where order_id = '${order_id}'`, function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ', results[0].solution);
        });
    } catch (err) {
        console.log("unable to update order", err)
    }
}

// Get price using api
const getPrice = async (address: string) => {
    try{
        console.log(address);
        const res = await axios.post('https://uruloki.vercel.app/api/tokens/token-price', {
            "pair_address": address, 
            "yesterday": false 
        });

        const result = res.data;

        console.log(result);

        if(result.payload) {
            return result.payload;
        } else {
            return 0;
        }

    } catch(err){
        console.error('error = ', err.response.data);
        return 0;
    }
}

// Check Order is ready to run
const getReadyOrder = async (pair_address: any, single_price: any, from_price: any, to_price: any, order_type: any, price_type: any) => {
    console.log('pair_address = ', pair_address);

    const price = await getPrice(pair_address);
    
    if(price !== 0) {
        if(price_type === 'range'){
            if(price >= Number(from_price) * 0.95 && price <= Number(to_price) * 1.05){
                return true;
            }
        } else if(price_type === 'single'){
            if(order_type === 'sell'){
                if(price >= Number(single_price) * 0.95){
                    return true;
                }
            } else if(order_type === 'buy'){
                if(price <= Number(single_price) * 1.05){
                    return true;
                }
            }
        }
    }

    return false;
}

// Get orders list from database
const get_orders = async () => {
    try {
        connection.query(`select order_id, pair_address, single_price, from_price, to_price, order_type, price_type from orders where status = 'Active' or status = 'OutOfFunds';`, async function (error, results, fields){
            if(error) throw error;

            console.info("successfully get orders from orders table " + results.length);
        
            let orderIdArray = [] as string[];
    
            for(let i = 0; i < results.length; i++){
                const result = results[i];

                const isReady = await getReadyOrder(result.pair_address, result.single_price, result.from_price, result.to_price, result.order_type, result.price_type);
                
                if(isReady) {
                    orderIdArray.push(result.order_id);
                }

                if(orderIdArray.length === maxLength){
                    await process_orders(orderIdArray);

                    orderIdArray = [];
                }
            }
    
            await sleep(1000 * 60 * 5);  // Sleeping for 5 minutes
            get_orders();
        });
        
    } catch(err) {
        console.log("get_orders error", err.message)
    }
}

// DB connect
dbconnect().then(() => {
    // If DB connect is success, run get_orders function
    get_orders();
}).catch((err) => {
    console.log("db connect error");
    console.error(err);
})