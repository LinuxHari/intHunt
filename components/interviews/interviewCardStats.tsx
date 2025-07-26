import { Star, Users, Calendar } from "lucide-react";

interface InterviewCardStatsProps {
  rating: Interview["rating"];
  attendees: number;
  // duration: number;
  questions: number;
}

export default function InterviewCardStats({
  rating,
  attendees,
  questions,
}: InterviewCardStatsProps) {
  return (
    <div className="flex gap-4 text-sm">
      <div className="flex items-center gap-1">
        <Calendar className="h-4 w-4 text-slate-400" />
        <span>{questions} questions</span>
      </div>
      {attendees > 0 && (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-slate-400" />
          <span>{attendees}</span>
        </div>
      )}
      {rating.count > 0 && (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="font-medium">
            {rating.average}({rating.count})
          </span>
        </div>
      )}
      {/* <div className="flex items-center gap-1">
        <Clock className="h-4 w-4 text-slate-400" />
        <span>{interview.duration}m</span>
      </div> */}
    </div>
  );
}
