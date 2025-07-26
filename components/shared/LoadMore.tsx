import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";

interface LoadMoreProps {
  loading: boolean;
  onClick: () => void;
}

const LoadMore = ({ loading, onClick }: LoadMoreProps) => {
  return (
    <div className="flex justify-center">
      <Button
        onClick={onClick}
        disabled={loading}
        variant="outline"
        className="min-w-32"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            Loading...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            Load More
            <ChevronDown className="h-4 w-4" />
          </div>
        )}
      </Button>
    </div>
  );
};

export default LoadMore;
