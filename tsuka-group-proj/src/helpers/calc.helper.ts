export function calculatePercentIncrease(buy: number, sell: number): number {
  const percentIncrease = (buy / (sell + buy)) * 100;
  return Math.floor(percentIncrease);
}

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

export const commafy2 = (num: number) => {
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
    result += " B";
  else if (million)
    result += " M";
  return result;
}

export const commafy3 = (num: number) => {
  let str = num.toString().split('.');
  if (str[0].length >= 3) {
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  if (str[1] && str[1].length >= 3) {
      str[1] = str[1].replace(/(\d{3})/g, '$1 ');
  }
  return str.join('.');
}

export const unCommafy = (num: any) => {
  return Number(num.replace(/,/g, ""));
}
