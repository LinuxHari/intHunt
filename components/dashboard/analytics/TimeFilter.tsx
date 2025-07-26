import { Button } from "@/components/ui/button";

interface TimeFilterProps {
  timeFilter: "week" | "month" | "year";
  setTimeFilter: (filter: "week" | "month" | "year") => void;
  durationFilters: readonly ("week" | "month" | "year")[];
}

const TimeFilter = ({
  timeFilter,
  setTimeFilter,
  durationFilters,
}: TimeFilterProps) => {
  return (
    <div className="flex items-center gap-2">
      {durationFilters.map((filter) => (
        <Button
          key={filter}
          variant={timeFilter === filter ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeFilter(filter)}
          className="capitalize"
        >
          {filter}
        </Button>
      ))}
    </div>
  );
};

export default TimeFilter;
