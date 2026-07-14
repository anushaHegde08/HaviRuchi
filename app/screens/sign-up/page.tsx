"use client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { IconInput } from "@/components/auth/IconInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordRules } from "@/components/auth/PasswordRules";
import ButtonLoadingSpinner from "@/components/loading/ButtonLoadingSpinner";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SignUpPage() {
  const { status } = useSession();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    general: "",
  });

  const clearErrors = () =>
    setErrors({ name: "", email: "", password: "", general: "" });

  // if already logged in → redirect to discover
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/screens/discover");
    }
  }, [status, router]);

  // show nothing while checking session
  if (status === "loading" || status === "authenticated") return null;

  const handleSignUpClick = async () => {
    clearErrors();
    // client side inline validation
    let hasError = false;

    if (!name) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      hasError = true;
    }
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      hasError = true;
    }
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      hasError = true;
    }
    if (hasError) return;

    try {
      setLoading(true);
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone: phoneNumber }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.error.includes("email")) {
          setErrors((prev) => ({ ...prev, email: data.error }));
        } else {
          setErrors((prev) => ({ ...prev, general: data.error }));
        }
        return;
      }
      toast.success("Account created successfully!");
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({
        ...prev,
        general: "Something went wrong. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error);
        return;
      }
      toast.success("Verification email resent!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setResendLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle={`We've sent a verification link to ${email}. Please verify your email to sign in.`}
      >
        <div className="flex flex-col gap-3 w-full">
          <Button
            className="w-full h-12 rounded-xl"
            onClick={() => router.push("/screens/sign-in")}
          >
            Go to Sign In
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl"
            onClick={handleResend}
            disabled={resendLoading}
          >
            {resendLoading ? <ButtonLoadingSpinner loadingText="Resending..." /> : "Resend Email"}
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Welcome!"
      subtitle="Sign up to discover and save authentic Havyaka recipes."
      footerText="Already have an account?"
      footerLinkText="Sign In"
      footerLinkHref="/screens/sign-in"
      buttonLoading={loading}
    >
      <div className="flex flex-col gap-1">
        <IconInput
          id="name"
          type="text"
          placeholder="Name"
          icon={<User className="h-4 w-4" />}
          value={name}
          className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
          onChange={(val) => {
            setName(val);
            if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
          }}
          inputProps={{ required: true }}
        />
        {errors.name && (
          <p className="text-xs text-destructive pl-1">{errors.name}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <IconInput
          id="email"
          type="email"
          placeholder="Email Address"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
          onChange={(val) => {
            setEmail(val);
            if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
          }}
          inputProps={{ required: true }}
        />
        {errors.email && (
          <p className="text-xs text-destructive pl-1">{errors.email}</p>
        )}
      </div>
      <IconInput
        id="phone"
        type="phoneNumber"
        placeholder="Phone Number(optional)"
        icon={<Phone className="h-4 w-4" />}
        value={phoneNumber}
        onChange={setPhoneNumber}
      />

      <div className="flex flex-col gap-1">
        <PasswordInput
          id="password"
          placeholder="Password"
          className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
          onChange={(val) => {
            setPassword(val);
            if (errors.password)
              setErrors((prev) => ({ ...prev, password: "" }));
          }}
        />
        {errors.password && (
          <p className="text-xs text-destructive pl-1">{errors.password}</p>
        )}
      </div>
      {/* General/server error */}
      {errors.general && (
        <p className="text-xs text-destructive text-center">{errors.general}</p>
      )}
      <PasswordRules password={password} />
      <Button
        className="w-full h-12 rounded-xl"
        type="submit"
        disabled={loading}
        onClick={handleSignUpClick}
      >
        {loading ? (
          <ButtonLoadingSpinner loadingText="Creating account..." />
        ) : (
          "Sign Up"
        )}
      </Button>
    </AuthLayout>
  );
}
