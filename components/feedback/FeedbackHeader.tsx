import dayjs from "dayjs";
import { Calendar } from "lucide-react";

interface FeedbackHeader {
  role: string;
  type: string;
  createdAt: Date;
}

const FeedbackHeader = ({ role, type, createdAt }: FeedbackHeader) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="flex-1">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Interview Feedback
        </h1>
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2">
          <p className="text-slate-600 dark:text-slate-400 capitalize">
            {role} • {type} Interview
          </p>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">
              {createdAt
                ? dayjs(createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackHeader;
