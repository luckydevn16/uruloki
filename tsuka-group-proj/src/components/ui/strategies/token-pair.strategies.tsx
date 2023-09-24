import { TokenIconSpan } from "../spans/token-icon.span";

export interface TokenPairStrategiesProps {
  id: string;
  code1: string;
  name1: string;
  code2: string;
  name2: string;
}

export const TokenPairStrategies: React.FC<TokenPairStrategiesProps> = ({
  id,
  code1,
  name1,
  code2,
  name2,
}) => {
  return (
    <div className="flex">
      {/* <div className="flex -space-x-3 mr-2">
        <TokenIconSpan code={code1} name={name1} />
        <TokenIconSpan code={code2} name={name2} />
      </div> */}
      <div className="flex flex-col">
        <span className="text-tsuka-50 text-sm">
          {code1}/{code2}
        </span>
        {/* <span className="text-tsuka-200 text-xs">ID: {id}</span> */}
      </div>
    </div>
  );
};
