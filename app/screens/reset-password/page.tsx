"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordRules } from "@/components/auth/PasswordRules";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ButtonLoadingSpinner from "@/components/loading/ButtonLoadingSpinner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link");
      router.push("/screens/forgot-password");
    }
  }, [token]);

  const handleSubmit = async () => {
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error);
        return;
      }

      toast.success("Password reset successfully!");
      setSuccess(true);
      router.push("/screens/sign-in");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your new password below."
      footerText="Remember your password?"
      footerLinkText="Sign In"
      footerLinkHref="/screens/sign-in"
      buttonLoading={loading && !success}
    >
      <PasswordInput
        id="password"
        placeholder="New password"
        onChange={setPassword}
      />
      <PasswordRules password={password} />
      <Button
        className="w-full h-12 rounded-xl"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
           <ButtonLoadingSpinner loadingText="Resetting..." />
        ) : (
          "Reset Password"
        )}
      </Button>
    </AuthLayout>
  );
}
