import { Order, TokenPriceInPair } from "@/types"
import axios from "axios"
import { Dispatch, SetStateAction } from "react"

export const getPairPriceInfo = async (selectedOrder: Order, setTokenPairPriceInfo: Dispatch<SetStateAction<TokenPriceInPair>>) => {
  const {data} = await axios.post("api/tokens/token-pair-price", {
    pair_address: selectedOrder.pair_address
  })

  setTokenPairPriceInfo(data.payload ?? {base_price: 0, quote_price: 0})
}

export const handleNumberInputChange = (setAmount: Dispatch<SetStateAction<string>>, setTargetPrice: Dispatch<SetStateAction<string>>, setMinPrice: Dispatch<SetStateAction<string>>, setMaxPrice: Dispatch<SetStateAction<string>>, name: string, event: any) => {
  let value = event.target.value.replace(/,/g, "");
  const pattern = /^\d*\.?\d*$/;
  if (!pattern.test(value)) return;
  let newValue = "";
  if (value.search("\\.") !== -1) {
    let [integerPart, decimalPart] = value.split(".");
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    newValue = `${integerPart}.${decimalPart ? decimalPart : ""}`;
  } else {
    newValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  switch (name) {
    case "amount":
      setAmount(newValue);
      break;
    case "target":
      setTargetPrice(newValue);
      break;
    case "min":
      setMinPrice(newValue);
      break;
    case "max":
      setMaxPrice(newValue);
      break;

    default:
      break;
  }
};

export const blurHandler = (setAmount: Dispatch<SetStateAction<string>>, setTargetPrice: Dispatch<SetStateAction<string>>, setMinPrice: Dispatch<SetStateAction<string>>, setMaxPrice: Dispatch<SetStateAction<string>>, name: string, event: any) => {
  let value = event.target.value.replace(/,/g, "");
  let newValue = "";
  if (!/^\d*\.?\d*$/.test(value)) {
    newValue = "0";
    return;
  } else {
    value = (+value).toString();
    let [integerPart, decimalPart] = value.split(".");
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    newValue = decimalPart
      ? `${integerPart}.${decimalPart}`
      : `${integerPart}`;
  }
  switch (name) {
    case "amount":
      setAmount(newValue);
      break;
    case "target":
      setTargetPrice(newValue);
      break;
    case "min":
      setMinPrice(newValue);
      break;
    case "max":
      setMaxPrice(newValue);
      break;

    default:
      break;
  }
};