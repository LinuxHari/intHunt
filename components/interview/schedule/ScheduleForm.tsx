import { Form } from "@/components/ui/form";
import useSchedule from "@/hooks/useSchedule";
import InterviewCard from "@/components/interview/schedule/ScheduleInterviewDetails";
import DatePicker from "@/components/interview/schedule/ScheduleDatePicker";
import TimeSelector from "@/components/interview/schedule/ScheduleTImeSelector";
import FormActions from "@/components/interview/schedule/ScheduleFormActions";

interface ScheduleFormProps {
  onOpenChange: (open: boolean) => void;
  interview: Interview;
}

const ScheduleForm = ({ onOpenChange, interview }: ScheduleFormProps) => {
  const {
    form,
    isScheduling,
    watchedDate,
    watchedTimeType,
    currentMonth,
    navigateMonth,
    onSubmit,
    handleClose,
  } = useSchedule(onOpenChange, interview);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <InterviewCard interview={interview} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DatePicker
            control={form.control}
            currentMonth={currentMonth}
            watchedDate={watchedDate}
            onNavigateMonth={navigateMonth}
          />

          <TimeSelector form={form} watchedTimeType={watchedTimeType} />
        </div>

        <FormActions onCancel={handleClose} isScheduling={isScheduling} />
      </form>
    </Form>
  );
};

export default ScheduleForm;
