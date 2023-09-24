export function splitAddress(address: string): string {
  return address
    ? address.slice(0, 5) + "..." + address.slice(address.length - 4)
    : "";
}
