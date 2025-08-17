"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/lib/actions/auth.action";
import Logo from "../shared/Logo";
import { signinFormSchema, signupFormSchema } from "@/validators";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

interface AuthFormProps {
  type: FormType;
  isModal?: boolean;
}

const AuthForm = ({ type, isModal = false }: AuthFormProps) => {
  const router = useRouter();

  const formSchema = type === "sign-in" ? signinFormSchema : signupFormSchema;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const result = await signUp({
          name: name!,
          email,
          password,
        });

        if (!result.success) return toast.error(result.message);

        toast.success(
          "Account created successfully. A confirmation mail is sent to your email."
        );
      } else {
        const { email, password } = data;

        const result = await signIn({
          email,
          password,
        });

        if (!result.success) return toast.error(result.message);

        toast.success("Signed in successfully.");
        if (isModal) {
          router.back();
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  const isSignIn = type === "sign-in";

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
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input
                        className="input"
                        placeholder="Enter your name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <Input
                      className="input"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isSignIn
                ? form.formState.isSubmitting
                  ? "Signing In..."
                  : "Sign In"
                : form.formState.isSubmitting
                ? "Creating an Account..."
                : "Create an Account"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-slate-900 dark:text-white">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <a // Making full page reload and preventing route being intercepted
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-semibold text-primary ml-1"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
