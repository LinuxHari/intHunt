import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface ScoreTrendChartProps {
  data: Array<{ name: string; interviews: number; score: number }>;
}

const ScoreChart = ({ data }: ScoreTrendChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white">
          Score Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[250px] md:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgb(148 163 184 / 0.3)"
                className="dark:stroke-slate-600"
              />
              <XAxis
                dataKey="name"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "rgb(100 116 139)", fontSize: 12 }}
                className="dark:[&_text]:fill-slate-300"
                dy={10}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "rgb(100 116 139)", fontSize: 12 }}
                className="dark:[&_text]:fill-slate-300"
                dx={-10}
                domain={["dataMin + 0", "dataMax + 5"]}
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
                        <p className="text-slate-900 dark:text-white font-medium">
                          {label}
                        </p>
                        <p className="text-green-600">
                          Score: {payload[0].value}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="fill-primary stroke-primary"
                strokeWidth={3}
                dot={{
                  fill: "rgb(34 197 94)",
                  strokeWidth: 2,
                  r: 4,
                  className: "fill-primary stroke-primary",
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  className: "fill-primary stroke-primary",
                }}
                className="stroke-primary"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreChart;
