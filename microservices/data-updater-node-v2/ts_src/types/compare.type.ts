export type Compare = {
  inputToken: {
    name: string;
    code: string;
  };
  outputToken: {
    name: string;
    code: string;
  };
  network: string;
  value: number;
  diference: {
    value: number;
    operator: "+" | "-";
  };
};
