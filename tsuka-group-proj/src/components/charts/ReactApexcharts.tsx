"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { ChartType } from "@/types/chart.type";

const ReactApexcharts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const donutColors = {
  series1: "#6FCF97",
  series2: "#EB5757",
};

const changeString = (val: number) => {
  const res = val.toLocaleString();
  return res;
};

export interface ChartProps {
  data: ChartType;
}

const Chart = (props: ChartProps) => {
  const { data } = props;
  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 150,
      width: "100%",
      fontFamily: "sans-serif",
    },
    stroke: {
      width: 5,
      colors: ["#1F2333"],
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        donut: {
          size: "85%",
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 38,
              formatter: () => "Total Orders",
            },
            value: {
              show: true,
              fontSize: "32px",
              fontFamily: "sans-serif",
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.7)",
              offsetY: -10,
            },
            total: {
              show: true,
              showAlways: true,
              color: "rgba(255, 255, 255, 0.5)",
              fontFamily: "sans-serif",
              fontSize: "16px",
              fontWeight: 400,
              formatter: (config: any) => config?.globals?.initialSeries?.reduce((a: any, b: any) => a + b, 0)
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    labels: ["Active", "Out of Funds"],
    legend: {
      show: false,
      position: "right",
      markers: { offsetX: 0 },
      itemMargin: {
        vertical: 0,
        horizontal: 0,
      },
    },

    colors: [donutColors.series1, donutColors.series2],
  };

  return (
    <div className="bg-[#1F2333] rounded-md py-[21] px-[18.75 ] mb-3 relative">
      <div className="mr-10">
        <ReactApexcharts
          type="donut"
          height={220}
          options={options}
          series={[data.active, data.out]}
        />
      </div>
      <div className="flex flex-col absolute top-[55px] right-3">
        <div className="font-Poppins-300 font-medium text-[10px] leading-[13px] text-[#6FCF97]">
          Active
        </div>
        <div className="font-Poppins-300 font-medium text-[16px] leading-[21px] text-[#BBC3D7]">
          {changeString(data.active)}
        </div>
        <div className="font-Poppins-300 font-medium text-[10px] leading-[13px] text-[#EB5757] mt-5">
          Out Of Funds
        </div>
        <div className="font-Poppins-300 font-medium text-[16px] leading-[21px] text-[#BBC3D7]">
          {changeString(data.out)}
        </div>
      </div>
    </div>
  );
};

export default Chart;
