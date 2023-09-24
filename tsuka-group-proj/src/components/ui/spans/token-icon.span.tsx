import { coinMirrorUrl } from "@/services/coin-mirror.service";
import { useState } from "react";

export interface TokenIconSpanProps {
  code: string;
  name: string;
}

export const TokenIconSpan: React.FC<TokenIconSpanProps> = ({ code, name }) => {
  const [hasError, setHasError] = useState(false);

  function handleImageInputError() {
    setHasError(true);
  }

  const inputIcon = `${coinMirrorUrl}/icon/${code.toLowerCase()}/200`;
  const defaultIcon = "/imgs/empty-img6.png";

  return (
    <img
      className="w-7 h-7 mb-auto rounded-full"
      src={hasError ? defaultIcon : inputIcon}
      alt={name}
      onError={handleImageInputError}
    />
  );
};
