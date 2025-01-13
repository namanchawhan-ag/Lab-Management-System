import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const BarChartCard = ({ entries, lab = false }) => {
  // const generateRandomColor = () => {
  //   const letters = "0123456789ABCDEF";
  //   let color = "#";
  //   for (let i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  // };

  // const colors = useMemo(() => {
  //   return Array.from({ length: entries.length }, generateRandomColor);
  // }, [entries.length]);

  const colors = [
    "#FFB6C1", "#FF6347", "#FFD700", "#98FB98", "#8A2BE2",
    "#D2691E", "#00BFFF", "#3CB371", "#8A2BE2", "#20B2AA",
    "#FF4500", "#DA70D6", "#32CD32", "#D3D3D3", "#ADFF2F",
    "#90EE90", "#FF1493", "#F08080", "#E0FFFF", "#F5FFFA",
    "#D8BFD8", "#FFDEAD", "#F4A460", "#6B8E23", "#B0E0E6",
    "#7FFF00", "#DC143C", "#FF69B4", "#FFF0F5", "#F5FFFA",
    "#FFE4E1", "#98AFC7", "#FF7F50", "#D3D3D3", "#B0C4DE",
    "#FFFFE0", "#AFEEEE", "#FFE4B5", "#FFD700", "#ADFF2F",
    "#CD5C5C", "#FF8C00", "#D2691E", "#FF6347", "#800080",
    "#B0E0E6", "#BA55D3", "#2E8B57", "#87CEEB", "#B22222"
  ];  

  const chartData = useMemo(() => {
    return entries.map((entry, index) => ({
      name: lab
        ? entry.lab_name
        : entry.test_sub_category == null
        ? "No Sub Categories"
        : entry.test_sub_category,
      count: parseInt(entry.entry_count, 10),
      color: colors[index % colors.length],
    }));
  }, [entries, lab]);

  // const chartConfig = {
  //   desktop: {
  //     label: "Desktop",
  //     color: "hsl(var(--chart-1))",
  //   },
  // }

  const generateConfig = (data) => {
    const config = {};
    data.forEach((entry, index) => {
      const key = `lab${index}`;
      config[key] = {
        color: colors[index % colors.length],
      };
    });
    return config;
  };

  const config = generateConfig(chartData);

  if (!entries?.length) {
    return <div>No data available</div>;
  }
  return (
    <Card className="border border-border motion-blur-in-md motion-duration-[2s] motion-opacity-in-0">
      <CardHeader>
        <CardTitle>
          {lab ? "Lab Entry Chart" : "Sub Category Entry Chart"}
        </CardTitle>
        <CardDescription>Parameter Accredited for Testing</CardDescription>
      </CardHeader>
      <CardContent className="">
        <ChartContainer
          className="min-h-[200px]"
          entriesAmt={chartData.length}
          config={config}
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                value.length > 15 ? `${value.slice(0, 15)}...` : value
              }
            />
            <YAxis />
            <ChartTooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="count" radius={8}>
              {chartData.map((entry, index) => (
                <>
                  <LabelList
                    key={`label-${entry.name}-${index}`}
                    position="top"
                    offset={4}
                    fontSize={12}
                    className=""
                  />
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                </>
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

BarChartCard.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      lab_name: PropTypes.string,
      test_sub_category: PropTypes.string,
      entry_count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  lab: PropTypes.bool,
};

export default BarChartCard;
