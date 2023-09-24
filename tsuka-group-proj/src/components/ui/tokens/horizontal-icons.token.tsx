import { coinMirrorUrl } from "@/services/coin-mirror.service";
import { useEffect, useState } from "react";

export interface HorizontalIconsTokenProps {
  inputToken: { code: string; name: string };
  outputToken: { code: string; name: string };
  large?: boolean;
}

export const HorizontalIconsToken: React.FC<HorizontalIconsTokenProps> = ({
  inputToken,
  outputToken,
  large = false,
}) => {
  const [hasInputError, setHasInputError] = useState(false);
  const [hasOutputError, setHasOutputError] = useState(false);

  function handleImageInputError() {
    setHasInputError(true);
  }

  function handleImageOutputError() {
    setHasOutputError(true);
  }

  useEffect(() => {
    setHasInputError(false);
  }, [inputToken]);

  useEffect(() => {
    setHasOutputError(false);
  }, [outputToken]);

  const inputIcon = `${coinMirrorUrl}/icon/${inputToken?.code.toLowerCase()}/200`;
  const outputIcon = `${coinMirrorUrl}/icon/${outputToken?.code.toLowerCase()}/200`;
  const defaultIcon = "/imgs/empty-img6.png";

  console.log(inputIcon, outputIcon);
  return (
    <div
      className={`${
        large ? "w-12 h-12" : "w-10 h-10"
      } mr-2 xs:mx-4 flex -space-x-4`}
    >
      <img
        className={`${large ? "w-10 h-10" : "w-8 h-8"} mb-auto rounded-full`}
        src={hasInputError ? defaultIcon : inputIcon}
        alt={inputToken?.name}
        onError={handleImageInputError}
      />
      <img
        className={`${large ? "w-10 h-10" : "w-8 h-8"} mt-auto rounded-full`}
        src={hasOutputError ? defaultIcon : outputIcon}
        alt={outputToken?.name}
        onError={handleImageOutputError}
      />
    </div>
  );
};
