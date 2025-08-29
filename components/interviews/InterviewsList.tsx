import InterviewCard from "./InterviewCard";

interface InterviewsGridProps {
  interviews: Array<Interview>;
  onSchedule: (interview: Interview) => void;
  onSelect: (interview: Interview) => void;
}

const InterviewsList = ({
  interviews,
  onSchedule,
  onSelect,
}: InterviewsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {interviews.map((interview) => (
        <InterviewCard
          key={interview.id}
          interview={interview}
          onSchedule={onSchedule}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default InterviewsList;
