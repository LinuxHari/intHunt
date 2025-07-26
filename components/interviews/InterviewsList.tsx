import InterviewCard from "./InterviewCard";

interface InterviewsGridProps {
  interviews: Interview[];
  onSchedule: (interview: Interview) => void;
  onAttendNow: (interview: Interview) => void;
}

const InterviewsList = ({
  interviews,
  onSchedule,
  onAttendNow,
}: InterviewsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {interviews.map((interview) => (
        <InterviewCard
          key={interview.id}
          interview={interview}
          onSchedule={onSchedule}
          onAttendNow={onAttendNow}
        />
      ))}
    </div>
  );
};

export default InterviewsList;
