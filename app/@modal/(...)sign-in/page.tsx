"use client";

import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const SignInModal = () => {
  const router = useRouter();
  return (
    <Dialog onOpenChange={router.back} open>
      <DialogContent className="!min-w-fit">
        <DialogTitle className="hidden">Sign In</DialogTitle>
        <AuthForm type="sign-in" isModal />
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
