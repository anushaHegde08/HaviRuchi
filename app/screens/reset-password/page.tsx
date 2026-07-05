"use client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordRules } from "@/components/auth/PasswordRules";
import ButtonLoadingSpinner from "@/components/loading/ButtonLoadingSpinner";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link");
      router.push("/screens/forgot-password");
    }
  }, [token, router]);

  const handleSubmit = async () => {
    setError("");
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
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
        setError(data.error);
        return;
      }

      toast.success("Password reset successfully!");
      setSuccess(true);
      router.push("/screens/sign-in");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
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
      <div className="flex flex-col gap-1.5 w-full">
        <PasswordInput
          id="password"
          placeholder="New password"
          className={error ? "border-destructive focus-visible:ring-destructive" : ""}
          onChange={(val) => {
            setPassword(val);
            if (error) setError("");
          }}
        />
        {error && <p className="text-xs text-destructive px-1">{error}</p>}
      </div>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
