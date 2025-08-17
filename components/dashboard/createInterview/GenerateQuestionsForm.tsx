import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { questionFormSchema, QuestionFormType } from "@/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

interface GenerateQuestionsFormProps {
  onGenerateQuestions: (formData: QuestionFormType) => void;
}

const GenerateQuestionsForm = ({
  onGenerateQuestions,
}: GenerateQuestionsFormProps) => {
  const form = useForm<QuestionFormType>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: { description: "", numOfQuestions: 20 },
  });

  const [isSubmittingForm, startFormTransition] = useTransition();

  const onSubmit = (formData: QuestionFormType) => {
    startFormTransition(() => onGenerateQuestions(formData));
  };

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <FormField
          control={form.control}
          name="numOfQuestions"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Number of questions *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmittingForm}>
            {isSubmittingForm ? (
              <div className="flex items-center gap-2">
                <Spinner />
                Generating...
              </div>
            ) : (
              "Generate questions"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GenerateQuestionsForm;
