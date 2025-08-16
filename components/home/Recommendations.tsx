import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InterviewCard from "../shared/InterviewCard";

interface RecommendationsProps {
  recommendations: Interview[];
}

const Recommendations = ({ recommendations }: RecommendationsProps) => {
  if (!recommendations || !recommendations.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          {recommendations.map((interview, index) => (
            <InterviewCard
              key={index}
              interviewId={interview.id}
              {...interview}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Recommendations;
