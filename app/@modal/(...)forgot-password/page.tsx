"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

const ForgotPassword = () => {
  const router = useRouter();

  return (
    <Dialog onOpenChange={router.back} open>
      <DialogContent className="!min-w-fit w-96">
        <DialogTitle>Reset Password</DialogTitle>
        <ForgotPasswordForm isModal />
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPassword;
