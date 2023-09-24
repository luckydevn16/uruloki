import CandleWidthButton from "./candlewidthbutton"

interface Props {
    active: number,
    candleStickClicked: (width: number) => void
}

const CandleWidthSelector: React.FC<Props> = ({active, candleStickClicked}) => {
    return (
        <div className="mt-2 border border-[rgba(67,70,81,1)] rounded-xl w-[230px] flex flex-row justify-around">
          <div className="-mr-[3px] -ml-[3px] w-full flex">
            <CandleWidthButton
              value_mins={15}
              text="15M"
              active={active}
              candleStickClicked={candleStickClicked}
            />
            <CandleWidthButton
              value_mins={30}
              text="30M"
              active={active}
              candleStickClicked={candleStickClicked}
            />
            <CandleWidthButton
              value_mins={60}
              text="1H"
              active={active}
              candleStickClicked={candleStickClicked}
            />
            <CandleWidthButton
              value_mins={360}
              text="6H"
              active={active}
              candleStickClicked={candleStickClicked}
            />
          </div>
        </div>
    )
}

export default CandleWidthSelector