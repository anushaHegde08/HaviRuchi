"use client";
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { IconInput } from "@/components/auth/IconInput";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error);
        return;
      }

      setSent(true); // show success state
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle={
        sent
          ? "Check your email for a reset link. It expires in 1 hour."
          : "Enter your email and we'll send you a reset link."
      }
      footerText="Remember your password?"
      footerLinkText="Sign In"
      footerLinkHref="/screens/sign-in"
    >
      {!sent ? (
        <>
          <IconInput
            id="email"
            type="email"
            placeholder="Enter your email"
            icon={<Mail className="h-4 w-4" />}
            value={email}
            onChange={setEmail}
          />
          <Button
            className="w-full h-12 rounded-xl"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Sending...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </>
      ) : (
        <div className="bg-primary/10 rounded-xl p-4 text-center text-sm text-primary">
          ✅ Reset link sent! Check your inbox.
        </div>
      )}
    </AuthLayout>
  );
}
