import { CardType } from "@/types/card.type";

export const filterTokens = (walletBalances: Array<CardType>) => {
  return walletBalances.filter((ele, id) => {
    //Filter out tokens that include https:// or .c in their name or shortName
    if(!(ele.shortName.includes('https://') || ele.name.includes("https://") || ele.shortName.includes('.c') || ele.name.includes('.c')))
      return ele;
  })
}
