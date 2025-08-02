import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { TIME_SLOTS } from "@/constants";
import { cn } from "@/lib/utils";
import { ScheduleFormType } from "@/schema";
import { Control, UseFormSetValue } from "react-hook-form";

interface SchedulePresetTimeSelectorProps {
  control: Control<ScheduleFormType>;
  setValue: UseFormSetValue<ScheduleFormType>;
}

const SchedulePresetTimeSelector = ({
  control,
  setValue,
}: SchedulePresetTimeSelectorProps) => {
  return (
    <FormField
      control={control}
      name="presetTime"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant={field.value === time ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 text-xs",
                    field.value === time && "ring-2 ring-blue-500"
                  )}
                  onClick={() => {
                    field.onChange(time);
                    setValue("customTime", "");
                  }}
                >
                  {time}
                </Button>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SchedulePresetTimeSelector;
