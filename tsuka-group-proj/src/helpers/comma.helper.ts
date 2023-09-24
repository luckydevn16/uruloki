export function numberWithCommas(value: number | string) {
  const options = {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  return value.toLocaleString("en-US", options);
}
