import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface InterviewStatsProps {
  questionsCount: number;
  takersCount: number;
  avgScore: number;
  createdDate: string;
}

const PublishedInterviewsStats = ({
  questionsCount,
  takersCount,
  avgScore,
  createdDate,
}: InterviewStatsProps) => {
  const stats = [
    { label: "Questions", value: questionsCount },
    { label: "Takers", value: takersCount },
    { label: "Avg Score", value: `${avgScore}%` },
    { label: "Created", value: createdDate },
  ];

  return (
    <Card>
      <CardHeader className="text-base font-semibold">
        Interview Stats
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-muted-foreground">{stat.label}</div>
              <div className="font-semibold text-foreground">{stat.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PublishedInterviewsStats;
