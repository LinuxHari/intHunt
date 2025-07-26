import { Users } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const NoInterviews = ({
  title,
  description,
  icon = <Users className="h-8 w-8 text-slate-400" />,
}: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
};

export default NoInterviews;
