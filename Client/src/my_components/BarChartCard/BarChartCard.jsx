import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
];

const BarChartCard = ({ entries, lab = false }) => {
  const chartData = useMemo(() => {
    return entries.map((entry, index) => ({
      lab: lab ? entry.lab_name : entry.test_sub_category,
      count: parseInt(entry.entry_count, 10),
      color: COLORS[index % COLORS.length],
    }));
  }, [entries, lab]);

  const config = useMemo(() => {
    return entries.reduce((acc, _, index) => {
      acc[`lab${index}`] = {
        color: COLORS[index % COLORS.length],
      };
      return acc;
    }, {});
  }, [entries]);

  if (!entries?.length) {
    return <div>No data available</div>;
  }

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>
          {lab ? "Lab Entry Chart" : "Sub Category Entry Chart"}
        </CardTitle>
        <CardDescription>Parameter Accredited for Testing</CardDescription>
      </CardHeader>
      <CardContent className="!max-h-[300px]">
        <ChartContainer config={config} className="!max-h-[300px]">
          <BarChart
            width={50}
            height={50}
            data={chartData}
            className="!max-h-[300px]"
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="lab"
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
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="" radius={8}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.lab}-${index}`}
                  fill={entry.color}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm mt-4">
        {entries.map((entry, index) => (
          <div 
            key={lab ? entry.lab_name : entry.test_sub_category} 
            className="flex items-center gap-2"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span>{lab ? entry.lab_name : entry.test_sub_category}</span>
          </div>
        ))}
      </CardFooter>
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
