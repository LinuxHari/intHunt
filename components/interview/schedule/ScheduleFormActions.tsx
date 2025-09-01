import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";

interface ScheduleFormActionsProps {
  onCancel: () => void;
  isScheduling: boolean;
}

const ScheduleFormActions = ({
  onCancel,
  isScheduling,
}: ScheduleFormActionsProps) => {
  return (
    <div className="flex gap-3 pt-4">
      <Button
        type="button"
        variant="outline"
        className="flex-1"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit" className="flex-1" disabled={isScheduling}>
        {isScheduling ? (
          <>
            <Spinner /> Scheduling...{" "}
          </>
        ) : (
          "Schedule Interview"
        )}
      </Button>
    </div>
  );
};

export default ScheduleFormActions;
