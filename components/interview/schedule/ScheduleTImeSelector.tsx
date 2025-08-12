import { UseFormReturn } from "react-hook-form";
import TimeTypeSelector from "@/components/interview/schedule/ScheduleTimeTypePicker";
import PresetTimeSelector from "@/components/interview/schedule/SchedulePresetTimeSelector";
import CustomTimeSelector from "@/components/interview/schedule/ScheduleCustomTimeSelector";
import { ScheduleFormType } from "@/validators";

interface ScheduleTimeSelectorProps {
  form: UseFormReturn<ScheduleFormType>;
  watchedTimeType: string;
}

const ScheduleTimeSelector = ({
  form,
  watchedTimeType,
}: ScheduleTimeSelectorProps) => {
  return (
    <div className="space-y-4">
      <TimeTypeSelector control={form.control} />

      {watchedTimeType === "preset" ? (
        <PresetTimeSelector control={form.control} setValue={form.setValue} />
      ) : (
        <CustomTimeSelector control={form.control} setValue={form.setValue} />
      )}

      {(form.watch("presetTime") || form.watch("customTime")) && (
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Selected:{" "}
          {watchedTimeType === "custom"
            ? form.watch("customTime")
            : form.watch("presetTime")}
        </div>
      )}
    </div>
  );
};

export default ScheduleTimeSelector;
