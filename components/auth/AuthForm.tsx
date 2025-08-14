"use client";

import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";
import Logo from "../shared/Logo";
import { signinFormSchema, signupFormSchema } from "@/validators";
import { cn } from "@/lib/utils";

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

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
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
          isModal ? "bg-background py-10 px-5" : "card py-14 px-10"
        )}
      >
        <Logo />

        <h3 className="text-primary">Nail Your Interview with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Button
              className="w-full"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
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

        <p className="text-center text-black dark:text-white">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-primary ml-1"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
