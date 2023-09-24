export interface LoadingBoxProps {
  title: string;
  description?: string;
}

export const LoadingBox: React.FC<LoadingBoxProps> = ({
  title,
  description,
}) => {
  return (
    <div className="z-50 fixed top-0 left-0 w-full h-full bg-[#13151f99] backdrop-blur-[2px] flex items-center justify-center">
      <div className="flex flex-col items-center w-[311px] md:w-[440px] h-[261px] md:h-[250px] pt-16 pb-10 px-6 md:py-12 rounded-2xl text-center bg-tsuka-500">
        <img className="rotate mb-4" src="/icons/loading.png" alt="loading" />
        <h3 className="mb-2 font-Steradian-500 text-lg leading-6 text-tsuka-50">
          {title}
        </h3>
        <p className="font-Steradian-400 text-sm leading-[18px] text-tsuka-200">
          {description}
        </p>
      </div>
    </div>
  );
};
