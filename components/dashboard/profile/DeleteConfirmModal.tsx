import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { AlertTriangle, Trash } from "lucide-react";

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  handleDeletion: VoidFunction;
}

const DeleteConfirmModal = ({
  open,
  onOpenChange,
  handleDeletion,
}: DeleteConfirmModalProps) => {
  const deleteUser = () => {
    onOpenChange(false);
    handleDeletion();
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-popover">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                Are you sure you want to delete your account?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="flex gap-3 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            onClick={deleteUser}
            className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmModal;
