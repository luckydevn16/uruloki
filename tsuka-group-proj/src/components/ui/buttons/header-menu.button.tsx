export interface HeaderMenuButtonProps {
  menuCollapsed: boolean;
  callback: () => void;
}

export const HeaderMenuButton: React.FC<HeaderMenuButtonProps> = ({
  menuCollapsed,
  callback,
}) => {
  return (
    <button
      type="button"
      onClick={callback}
      className={`inline-flex items-center justify-center md:hidden ${menuCollapsed ? "bg-tsuka-700" : "bg-tsuka-500"} rounded-full p-2 ${menuCollapsed ? "text-tsuka-400" : "text-primary"} focus:outline-none`}
      aria-controls="mobile-menu"
      aria-expanded="false"
    >
      <span className="sr-only">Open main menu</span>
      <svg
        className="block h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
      <svg
        className="hidden h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};
