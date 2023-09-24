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

export function percentChange(initial: number, final: number): number {
  return 100 * ((final - initial) / initial)
}