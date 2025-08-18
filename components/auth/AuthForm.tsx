"use client";

import { Button } from "@/components/ui/button";
import Logo from "../shared/Logo";

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
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import Spinner from "../ui/spinner";

export interface AuthFormProps {
  type: FormType;
  isModal?: boolean;
}

const AuthForm = ({ type, isModal = false }: AuthFormProps) => {
  const { isSignIn, onSubmit, form } = useAuth({ type, isModal });

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
              {form.formState.isSubmitting && <Spinner />}
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
        {isSignIn ? (
          isModal ? (
            <a
              href="/forgot-password"
              className="font-semibold text-primary hover:underline decoration-1"
            >
              Forgot password?
            </a>
          ) : (
            <Link
              className="font-semibold text-primary hover:underline decoration-1"
              href="/forgot-password"
            >
              Forgot password?
            </Link>
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
