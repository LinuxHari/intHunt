"use client";

import { useTransition } from "react";
import Logo from "../shared/Logo";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import Spinner from "../ui/spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordType } from "@/validators";
import { resetPassword } from "@/lib/actions/auth.action";
import { toast } from "sonner";

interface ResetPasswordFormProps {
  code: string;
}

const ResetPasswordForm = ({ code }: ResetPasswordFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver<ResetPasswordType>(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (data: ResetPasswordType) => {
    startTransition(async () => {
      const { success, message } = await resetPassword({
        code,
        password: data.newPassword,
      });
      if (!success) {
        toast.error(message);
      } else {
        toast.success("Password resetted successfully");
      }
    });
  };

  return (
    <div className="lg:min-w-[566px] card-border">
      <div className="flex flex-col items-center gap-6 w-full card py-14 px-10">
        <Logo />
        <h3 className="text-primary text-center">
          Nail Your Interview with AI
        </h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password *</FormLabel>
                  <FormControl>
                    <Input
                      className="input"
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password *</FormLabel>
                  <FormControl>
                    <Input
                      className="input"
                      placeholder="Enter new password again"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner /> Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
