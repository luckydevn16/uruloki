export interface HeaderWalletButtonProps {
  callback: () => void;
  wallet: {
    label: string;
  };
}

export const HeaderWalletButton: React.FC<HeaderWalletButtonProps> = ({
  callback,
  wallet: { label },
}) => {
  return (
    <button
      type="button"
      onClick={callback}
      className="text-tsuka-100 bg-tsuka-500 hover:bg-tsuka-500 focus:outline-none rounded text-sm px-4 py-2 text-center inline-flex items-center mr-2"
    >
      <img
        src="/logos/metamask-icon.svg"
        alt="metamask-icon"
        className="mr-2"
      />
      {label}
    </button>
  );
};
