import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface InterviewCountChartProps {
  data: Array<{ name: string; interviews: number; score: number }>;
}

const InterviewCountChart = ({ data }: InterviewCountChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white">
          Interview Count
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[250px] md:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
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
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
                        <p className="text-slate-900 dark:text-white font-medium">
                          {label}
                        </p>
                        <p className="text-primary">
                          Interviews: {payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="interviews"
                fill="rgb(59 130 246)"
                className="dark:fill-primary"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewCountChart;
