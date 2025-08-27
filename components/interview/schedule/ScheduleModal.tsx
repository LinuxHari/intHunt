"use client";
import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ScheduleForm from "./ScheduleForm";

interface ScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview: Interview;
  isAuthenticated: boolean;
}

const ScheduleModal = ({
  open,
  onOpenChange,
  interview,
  isAuthenticated,
}: ScheduleModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Interview
          </DialogTitle>
          <DialogDescription>
            Choose a convenient date and time for your {interview.role}{" "}
            interview.
          </DialogDescription>
        </DialogHeader>
        <ScheduleForm
          onOpenChange={onOpenChange}
          interview={interview}
          isAuthenticated={isAuthenticated}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleModal;
