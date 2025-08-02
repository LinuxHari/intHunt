import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Control, UseFormSetValue } from "react-hook-form";
import { ScheduleFormType } from "@/schema";

interface ScheduleCustomTimeSelectorProps {
  control: Control<ScheduleFormType>;
  setValue: UseFormSetValue<ScheduleFormType>;
}

const ScheduleCustomTimeSelector = ({
  control,
  setValue,
}: ScheduleCustomTimeSelectorProps) => {
  return (
    <FormField
      control={control}
      name="customTime"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="space-y-2">
              <Input
                type="time"
                {...field}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  setValue("presetTime", "");
                }}
                className="w-full"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter time in 24-hour format.
              </p>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ScheduleCustomTimeSelector;
