export interface BlurProps {
  width: number;
  height: number;
  top: number;
  left: number;
  blurSize: number;
  circles: BlurCircleProps[];
}

export interface BlurCircleProps {
  radius: number;
  left: number;
  top: number;
  color: string;
}

export const BlurLanding: React.FC<BlurProps> = ({
  width,
  height,
  left,
  top,
  blurSize,
  circles,
}) => {
  const divStyle = {
    width: `${width}px`,
    height: `${height}px`,
    left: `${left}px`,
    top: `${top}px`,
    filter: `blur(${blurSize}px)`,
  };
  return (
    // <div className="absolute inset-0 flex justify-center items-center">
    //   <div className="rounded-full"  style={divStyle}></div>
    //   <div className="rounded-full"  style={divStyle}></div>
    // </div>
    <div
      className="w-[889px] h-[629px] left-[-401px] top-[-25px] filter blur-[200px] absolute"
      style={divStyle}
    >
      {circles.map((circleProp, i) => {
        let circleStyle = {
          width: `${circleProp.radius}px`,
          height: `${circleProp.radius}px`,
          left: `${circleProp.left}px`,
          top: `${circleProp.top}px`,
          backgroundColor: `${circleProp.color}`,
        };
        return <div key={circleProp.color + i} className="rounded-full absolute" style={circleStyle}></div>;
      })}
      {/* <div className="rounded-full w-[629px] h-[629px] left-0 top-0 bg-[#2DB38A] text-[#2DB28A] absolute"></div>
      <div className="rounded-full w-[393px] h-[393px] right-0 top-[166px] bg-[#2DB38A] text-[#2DB28A] absolute"></div> */}
    </div>
  );
};
