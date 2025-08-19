import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
interface ResetProps {
  searchParams: Promise<{ code: string }>;
}

const ResetPassword = async ({ searchParams }: ResetProps) => {
  const { code } = await searchParams;

  if (!code || !code.trim()) redirect("/");

  return <ResetPasswordForm code={code} />;
};

export default ResetPassword;
