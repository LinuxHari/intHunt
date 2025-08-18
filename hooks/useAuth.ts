import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { signinFormSchema, signupFormSchema } from "@/validators";
import { AuthFormProps } from "@/components/auth/AuthForm";
import { useEffect } from "react";

const useAuth = ({ type, isModal }: AuthFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  useEffect(() => {
    let timeoutId = null;
    if (isSignIn && searchParams.get("resetExpired") === "true") {
      console.log("showing toast for reset expired");

      timeoutId = setTimeout(() => {
        toast.error("Password reset link has expired");
      }, 1000);
      // router.replace("/sign-in");
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return {
    isSignIn,
    onSubmit,
    form,
  };
};

export default useAuth;
