import { coinMirrorUrl } from "@/services/coin-mirror.service";
import { useEffect, useState } from "react";

export interface TokenIconsTokenProps {
  name: string;
  shortName: string;
  width?: number;
  height?: number;
  className?: string;
}

export const TokenIconsToken: React.FC<TokenIconsTokenProps> = ({
  name,
  shortName,
  width = 24,
  height = 24,
  className = "",
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [name, shortName]);

  function handleImageInputError() {
    setHasError(true);
  }

  const img = `${coinMirrorUrl}/icon/${shortName?.toLowerCase()}/200`;

  return (
    <div className={className + " rounded-full overflow-hidden bg-transparent"}>
      <img
        src={hasError ? "/imgs/empty-img6.png" : img}
        width={width}
        height={height}
        alt="token"
        onError={handleImageInputError}
      />
    </div>
  );
};
