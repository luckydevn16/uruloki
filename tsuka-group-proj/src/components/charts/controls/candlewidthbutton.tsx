interface CandleWithButtonProps {
    value_mins: number;
    text: string;
    active: number;
    candleStickClicked: (width: number) => void;
}
  
const CandleWidthButton: React.FC<CandleWithButtonProps> = ({value_mins, text, active, candleStickClicked}) => {
    return (
      <button
        onClick={() => candleStickClicked(value_mins)}
        className={`${
          active === value_mins ? "bg-[rgba(51,150,255,1)]" : ""
        } m-[3px] pt-[4px] pb-[4px] w-[50px] tracking-wide mb-[3px] transition duration-300 text-white rounded-md `}
      >
        {text}
      </button>
    )
}

export default CandleWidthButton