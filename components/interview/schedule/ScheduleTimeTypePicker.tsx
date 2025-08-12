import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScheduleFormType } from "@/validators";
import { Control } from "react-hook-form";

interface ScheduleTimeTypeSelectorProps {
  control: Control<ScheduleFormType>;
}

const ScheduleTimeTypeSelector = ({
  control,
}: ScheduleTimeTypeSelectorProps) => {
  return (
    <FormField
      control={control}
      name="timeType"
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="font-semibold text-slate-900 dark:text-white">
            Select Time
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="preset" id="preset" />
                <label
                  htmlFor="preset"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Preset
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <label
                  htmlFor="custom"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Custom
                </label>
              </div>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default ScheduleTimeTypeSelector;
