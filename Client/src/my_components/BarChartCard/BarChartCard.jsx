import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
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
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEEAD",
    "#D4A5A5",
  ];

  const chartData = lab ? entries.map(({ lab_name, entry_count }, index) => ({
    lab: lab_name,
    count: parseInt(entry_count, 10),
    color: colors[index % colors.length],
  })) : entries.map(({ test_sub_category, entry_count }, index) => ({
    lab: test_sub_category,
    count: parseInt(entry_count, 10),
    color: colors[index % colors.length],
  }));

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

  const config = generateConfig(entries);

  return (
    <Card className="border ">
      <CardHeader>
        <CardTitle>{lab ? "Lab Entry Chart" : "Sub Category Entry Chart"}</CardTitle>
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
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm mt-4">
        {lab ? entries.map((entry, index) => (
          <div key={entry.lab_name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span>{entry.lab_name}</span>
          </div>
        )) : entries.map((entry, index) => (
          <div key={entry.test_sub_category} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span>{entry.test_sub_category}</span>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
};

export default BarChartCard;
