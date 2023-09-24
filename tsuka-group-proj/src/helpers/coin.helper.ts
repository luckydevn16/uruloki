export const formatNumber = (x: number, suffix0 = false): string => {
  const isNegative = x < 0;
  const parts = Math.abs(x).toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (suffix0) {
    if (parts.length == 1) {
      parts.push("00");
    }
  }
  if (parts.length == 2) {
    parts[1] = parts[1].length == 1 ? "" + parts[1] + "0" : parts[1];
  }
  const formatted = parts.join(".");
  return isNegative ? "-" + formatted : formatted;
};

export const formatCurrency = (x: number, suffix0 = false): string => {
  return `$${formatNumber(x, suffix0)}`;
};

export const formatSignedPercent = (x: number, suffix0 = false): string => {
  let sign = x >= 0 ? "+" : "";
  return `${sign}${formatNumber(x, suffix0)}%`;
};

export const formatFixed2 = (x: number): string => {
  return Number.parseFloat(x.toString()).toFixed(2);
};

export const formatCurrencyFixed2 = (x: number, suffix0 = false): string => {
  return formatCurrency(Number.parseFloat(formatFixed2(x)), suffix0);
};

/**
 * 0.00000427 => 0.0_543
 * @param x
 * @returns
 */
export function formatNumberToHtmlTag(num: number): {integerPart: string, leadingZerosCount: number, remainingDecimal: string} {
  

  let numStr = '';
  if (num !== null && num !== undefined) {
    numStr = num.toString();
  }
  
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





