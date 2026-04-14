import { Pie, PieChart, Sector } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { name: 'Tantacom', visitors: 275, fill: '#5C6AFA' },
  { name: 'other', visitors: 200, fill: '#79E5D5' },
  { name: 'other', visitors: 187, fill: '#F1C85A' },
  { name: 'other', visitors: 173, fill: '#FF8F6B' },
  //   { name: 'other', visitors: 90, fill: 'var(--color-other)' },
];
const chartConfig = {
  //   visitors: {
  //     label: 'Visitors',
  //   },
  chrome: {
    label: 'Tantacom',
    color: 'hsl(var(--chart-1))',
  },
  safari: {
    label: 'other',
    color: 'hsl(var(--chart-2))',
  },
  firefox: {
    label: 'other',
    color: 'hsl(var(--chart-3))',
  },
  edge: {
    label: 'other',
    color: 'hsl(var(--chart-4))',
  },
  //   other: {
  //     label: 'Other',
  //     color: 'hsl(var(--chart-5))',
  //   },
};

const SellingVendorChart = () => {
  return (
    <div className="flex flex-col items-start bg-white rounded-[16px] w-full h-full">
      <header className="flex items-center py-3 px-6">
        <h3 className="font-medium text-[18px] leading-[25px] text-[#343C6A]">
          Top Selling Vendors
        </h3>
      </header>
      <div className="flex flex-col justify-center items-center p-5 gap-2.5 bg-white rounded-[25px] w-full h-full ">
        <div className="flex-1 p-0 h-full w-full">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
                activeIndex={0}
                activeShape={({ outerRadius = 0, ...props }) => (
                  <Sector {...props} outerRadius={outerRadius + 10} />
                )}
              />
            </PieChart>
          </ChartContainer>
        </div>

        <div className="grid grid-cols-2  gap-4 mt-4">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.fill }}
              ></div>

              <span className="text-[14px] leading-[17px] font-medium text-[#718EBF]">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellingVendorChart;
