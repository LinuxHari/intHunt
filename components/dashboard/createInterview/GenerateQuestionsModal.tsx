import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuestionFormType } from "@/validators";
import { FileQuestion } from "lucide-react";
import GenerateQuestionsForm from "./GenerateQuestionsForm";

interface GenerateQuestionsModalProps {
  open: boolean;
  onOpenChange: (state: boolean) => void;
  onGenerateQuestions: (formData: QuestionFormType) => void;
}

const GenerateQuestionsModal = ({
  open,
  onOpenChange,
  onGenerateQuestions,
}: GenerateQuestionsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5" />
            Generate Questions
          </DialogTitle>
          <DialogDescription>Generate questions with AI</DialogDescription>
        </DialogHeader>
        <GenerateQuestionsForm onGenerateQuestions={onGenerateQuestions} />
      </DialogContent>
    </Dialog>
  );
};

export default GenerateQuestionsModal;
