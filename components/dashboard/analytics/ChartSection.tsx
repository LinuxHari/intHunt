import InterviewCountChart from "./InterviewChart";
import ScoreChart from "./ScoreChart";

interface ChartsSectionProps {
  data: Array<{ name: string; interviews: number; score: number }>;
}

const ChartsSection = ({ data }: ChartsSectionProps) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <InterviewCountChart data={data} />
      <ScoreChart data={data} />
    </div>
  );
};

export default ChartsSection;
