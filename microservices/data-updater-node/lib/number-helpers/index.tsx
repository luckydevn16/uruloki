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

export const commafy = (num: number) => {
  let billion: boolean = false;
  let million: boolean = false;
  if (num / 1000000000 > 1) {
    billion = true;
    num = Math.floor(num / 10000000) / 100;
  } else if (num / 1000000 > 1) {
    million = true;
    num = Math.floor(num / 10000) / 100;
  }
  let str = num.toString().split('.');
  if (str[0].length >= 3) {
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  if (str[1] && str[1].length >= 3) {
      str[1] = str[1].replace(/(\d{3})/g, '$1 ');
  }
  let result = str.join('.');
  if (billion)
    result += " Billion";
  else if (million)
    result += " Million";
  return result;
}

/**
 * 0.00000427 => 0.0_543
 * @param x
 * @returns
 */
export function formatNumberToHtmlTag(num: number): {integerPart: string, leadingZerosCount: number, remainingDecimal: string} {
  
  let numStr = num.toString();
  
  if (numStr.indexOf('e') !== -1) {
    const exponent = parseInt(numStr.split('e')[1]);
    numStr = parseFloat(numStr).toFixed(Math.abs(exponent-parseInt(numStr.split('e')[0])));
  }
  const parts = numStr.split('.');
  
  if (parts.length === 1) {
    return {integerPart: parts[0], leadingZerosCount: 0, remainingDecimal: ''};
  }

  const integerPart = parts[0];
  const decimalPart = parts[1];

  const leadingZeros = decimalPart.match(/^0*/) ?? [''];
  const leadingZerosCount = leadingZeros[0].length;
  
  
  let remainingDecimal = decimalPart.slice(leadingZerosCount, decimalPart.length).split('0')[0];  
  if(remainingDecimal.length < 3 ) remainingDecimal += ("000").slice(0, 3-remainingDecimal.length);
  else remainingDecimal = remainingDecimal.slice(0, 3);
  
  return {integerPart, leadingZerosCount, remainingDecimal};
}

export function fixedDecimal(x: number, d: number) {
  const p = Math.pow(10, d);
  return Number((x * p).toFixed(0)) / p;
}

export function percentChange(initial: number, final: number): number {
  return 100 * ((final - initial) / initial)
}