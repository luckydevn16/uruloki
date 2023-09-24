import { commafy, commafy2 } from "@/helpers/calc.helper";
import { formatNumberToHtmlTag } from "@/helpers/coin.helper";

export const convertLawPrice = (price: number) => {
  let priceEle;
  if (price >= 0.01) {
    priceEle = `$${commafy(price)}`;
  } else {
    priceEle = (
      <>
        {formatNumberToHtmlTag(price).integerPart}
        .0
        <sub>{formatNumberToHtmlTag(price).leadingZerosCount}</sub>
        {formatNumberToHtmlTag(price).remainingDecimal}
      </>
    );
  }
  return priceEle;
};

export const handleNumberFormat = (num: number): string => {
  let value = num.toString();
  const pattern = /^\d*\.?\d*$/;
  if (!pattern.test(value)) return "";
  let newValue = "";
  if (value.search("\\.") !== -1) {
    let [integerPart, decimalPart] = value.split(".");
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    newValue = `${integerPart}.${decimalPart ? decimalPart : ""}`;
  } else {
    newValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return newValue;
};

export const toNumber = (str: string): number => {
  const value = str.replace(/,/g, "");
  const num = Number(value);
  if (Number.isNaN(num)) {
    return -1;
  }
  return num;
};

/**
 * Optimizes numbers so that either very small values can be represented using the subscript notation seen on the homepage if the value is less than 0.01, or for larger values will display them as normal currency
 * @param price
 * @returns
 */
export function commafyOrHtmlTag(
  price: number,
  includeDollarSign: boolean = true
) {
  var output;

  if (price == 0) {
    output = 0;
  } else if (price >= 1) {
    output = `${includeDollarSign ? "$" : ""}${commafy(price)}`;
  } else if(price >= 0.01) {
    const sigfigs = 3
    let firstSignificantFigureIndex = 0
    for(let i of price.toString()) {
      if(i != '0' && i != '.') {
        break
      }
      firstSignificantFigureIndex++
    }
    output = `${includeDollarSign ? "$" : ""}${price.toString().substring(0, firstSignificantFigureIndex + sigfigs)}`;
  } else {
    output = (
      <>
        {includeDollarSign ? "$" : ""}
        {formatNumberToHtmlTag(price).integerPart}.0
        <sub>{formatNumberToHtmlTag(price).leadingZerosCount}</sub>
        {formatNumberToHtmlTag(price).remainingDecimal}
      </>
    );
  }

  return output;
}

export function fixedDecimal(x: number, d: number) {
  const p = Math.pow(10, d);
  return Number((x * p).toFixed(0)) / p;
}

export function percentChange(initial: number, final: number): number {
  return 100 * ((final - initial) / initial)
}