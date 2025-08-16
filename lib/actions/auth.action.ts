"use server";

import env from "@/env";
import { createClient } from "@/supabase/admin";
import { AuthApiError } from "@supabase/supabase-js";

export const signUp = async (params: SignUpParams) => {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          name: params.name,
        },
        emailRedirectTo: `${env.NEXT_PUBLIC_BASE_URL}/sign-in`,
      },
    });

    if (error) throw error;

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: unknown) {
    console.error("Error creating user:", error);

    if (error instanceof AuthApiError && error.code === "email_exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
};

export const signIn = async (params: SignInParams) => {
  const supabase = await createClient();
  const { email, password } = params;

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { success: true, message: "Signed in successfully" };
  } catch (error: unknown) {
    console.log(error, "error occured in authentication");

    if (error instanceof AuthApiError) {
      if (error.code === "user_not_found")
        return {
          success: false,
          message: "User does not exist",
        };
      else if (error.code === "invalid_credentials")
        return {
          success: false,
          message: "Invalid email or password",
        };
      else if (error.code === "provider_email_needs_verification")
        return {
          success: false,
          message: "Email is not verified yet",
        };
    }

    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
};

export const signOut = async () => {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    return { success: true };
  } catch (error: unknown) {
    console.error(error, "Error occured while signing out");
    return { success: false };
  }
};

export const deleteUser = async () => {
  try {
    const supabase = await createClient();
    const user = await getCurrentUser();

    if (!user) throw "User is not authenticated";

    await supabase.auth.admin.deleteUser(user.id);
    return { success: true };
  } catch (error: unknown) {
    console.error("An error occured while deleting user", error);
    return { success: false };
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user?.email) return null;

    return {
      email: data.user.email,
      id: data.user.id,
      name: data.user.user_metadata.name as string,
      createdAt: data.user.created_at,
      updatedAt: data.user.updated_at,
      role: data.user.user_metadata.role as string,
      about: data.user.user_metadata.about as string,
      avatar: data.user.user_metadata.avatar as string,
    };
  } catch (error: unknown) {
    console.error(error, "Error while getting current user");

    return null;
  }
};

export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return !!user;
};
