import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
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

const BarChartCard = ({ entries, lab = false }) => {
  const chartData = useMemo(() => {
    return entries.map((entry) => ({
      lab: lab ? entry.lab_name : entry.test_sub_category,
      count: parseInt(entry.entry_count, 10),
    }));
  }, [entries, lab]);

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  }

  if (!entries?.length) {
    return <div>No data available</div>;
  }
  return (
    <Card className="border border-border">
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
          config={chartConfig}
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
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="count" fill="var(--color-foreground)" radius={8}>
              {chartData.map((entry, index) => (
                <LabelList
                  key={`label-${entry.lab}-${index}`}
                  position="top"
                  offset={12}
                  fontSize={12}
                />
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
