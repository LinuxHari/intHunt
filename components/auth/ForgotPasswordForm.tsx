import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
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
import { resetPassword } from "@/lib/actions/auth.action";
import { toast } from "sonner";
import { resetPasswordSchema, ResetPasswordType } from "@/validators";

interface ForgotPasswordFormProps {
  isModal?: boolean;
}

const ForgotPasswordForm = ({ isModal = false }: ForgotPasswordFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = (data: ResetPasswordType) => {
    startTransition(async () => {
      try {
        const { success, message } = await resetPassword(data.email);
        if (!success) {
          toast.error(message);
          return;
        }
        toast.success("Reset mail is sent to your email");
      } catch (error: unknown) {
        console.error(error);
        toast.error("Failed to reset password. Please try again.");
      }
    });
  };

  return (
    <div
      className={cn(null, isModal ? "w-full" : "lg:min-w-[566px] card-border")}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-6 w-full",
          isModal ? "bg-background md:px-5" : "card py-14 px-10"
        )}
      >
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      className="input"
                      placeholder="Enter your email"
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
                  <Spinner /> Sending Reset Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
