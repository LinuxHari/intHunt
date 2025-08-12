import { useState, useTransition } from "react";
import {
  CreateInterviewFormType,
  createInterviewSchema,
  QuestionFormType,
} from "@/validators";
import {
  createInterview,
  generateInterviewQuestions,
} from "@/lib/actions/interview.action";
import { toast } from "sonner";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const useCreateInterview = () => {
  const form = useForm<CreateInterviewFormType>({
    resolver: zodResolver(createInterviewSchema),
    defaultValues: {
      role: "",
      questions: [{ value: "" }, { value: "" }],
      difficulty: undefined,
      techstack: "",
      level: undefined,
      type: undefined,
      description: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const [isSubmitting, startSubmitTransition] = useTransition();
  const [isShowQuestionsModal, setIsShowQuestionsModal] = useState(false);

  const generateQuestions = async (questionData: QuestionFormType) => {
    const isValid = await form.trigger([
      "role",
      "description",
      "type",
      "techstack",
      "level",
      "difficulty",
    ]);

    if (isValid) {
      const formValues = form.getValues();
      const { questions } = await generateInterviewQuestions({
        ...formValues,
        amount: questionData.numOfQuestions,
        description: questionData.description,
      });
      if (questions && questions.length) {
        const transformedQuestions = questions.map((question) => ({
          value: question,
        }));
        const existingQuestions = formValues.questions.filter(
          (question) => question.value
        );
        const finalQuestions = existingQuestions.concat(transformedQuestions);
        form.setValue("questions", finalQuestions);
      } else {
        form.setError("questions", {
          type: "custom",
          message: "Something went wrong while generating questions with AI.",
        });
      }
    }
    setIsShowQuestionsModal(false);
  };

  const onSubmit = async (interviewDetails: CreateInterviewFormType) => {
    startSubmitTransition(async () => {
      const { success } = await createInterview(interviewDetails);
      if (success) {
        form.reset();
        toast.success("Interview created successfully");
      } else toast.error("Failed to create interview");
    });
  };

  return {
    form,
    isSubmitting,
    fields,
    isShowQuestionsModal,
    setIsShowQuestionsModal,
    append,
    remove,
    onSubmit,
    generateQuestions,
  };
};

export default useCreateInterview;
