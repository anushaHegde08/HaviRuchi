"use client";
import { Button } from "@/components/ui/button";
import { Chrome, GoalIcon, Mail } from "lucide-react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { IconInput } from "@/components/auth/IconInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";

export default function SignInPage() {
  const { status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const clearErrors = () => setErrors({ email: "", password: "", general: "" });

  // if already logged in → redirect to discover
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/screens/discover");
    }
  }, [status, router]);

  // show nothing while checking session
  if (status === "loading" || status === "authenticated") return null;

  const handleSignInClick = async () => {
    // if (!email || !password) {
    //   toast.error("Please fill in all fields");
    //   return;
    // }
    console.log(email, password);

    clearErrors();
    let hasError = false;
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
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // ← handle redirect manually
      });
      if (result?.error) {
        // NextAuth returns error as URL encoded string
        // decode it to get actual message
        const decodedError = decodeURIComponent(result.error);

        const errorMessages: Record<string, string> = {
          "No user found with this email": "No account found with this email",
          "Incorrect password": "Incorrect password",
          "Please sign in with Google": "This email is registered with Google",
        };
        const message = errorMessages[decodedError] ?? "Something went wrong";

        if (decodedError.includes("password")) {
          setErrors((prev) => ({ ...prev, password: message }));
        } else if (
          decodedError.includes("email") ||
          decodedError.includes("user")
        ) {
          setErrors((prev) => ({ ...prev, email: message }));
        } else {
          setErrors((prev) => ({ ...prev, general: message }));
        }
        return;
      }
      toast.success("Welcome back!");
      router.replace("/screens/discover");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signIn("google", {
        callbackUrl: "/screens/discover",
        prompt: "select_account", // ← always show account picker
      });
    } catch (error) {
      toast.error("Google sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to add and manage your recipes"
      footerText="Don't have any account?"
      footerLinkText="Sign Up"
      footerLinkHref="/screens/sign-up"
      buttonLoading={loading}
      showLogo
    >
      <div className="flex flex-col gap-1">
        <IconInput
          id="email"
          type="email"
          value={email}
          placeholder="Email or phone number"
          icon={<Mail className="h-4 w-4" />}
          onChange={setEmail}
        />
        {errors.email && (
          <p className="text-xs text-destructive pl-1">{errors.email}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <PasswordInput
          id="password"
          placeholder="Password"
          onChange={setPassword}
        />
        {errors.password && (
          <p className="text-xs text-destructive pl-1">{errors.password}</p>
        )}
      </div>
      {errors.general && (
        <p className="text-xs text-destructive text-center">{errors.general}</p>
      )}
      <div className="flex justify-end -mt-2">
        <Link
          href="/auth/forgot-password"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        onClick={handleSignInClick}
        disabled={loading}
        className="w-full h-12 rounded-xl"
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-muted" />
        <span className="text-xs text-muted-foreground">Or continue with</span>
        <div className="h-px flex-1 bg-muted" />
      </div>

      <Button
        variant="ghost"
        onClick={handleGoogleSignIn}
        className="w-full h-12 rounded-xl gap-2"
      >
        <FcGoogle className="h-4 w-4" />
        Google
      </Button>
    </AuthLayout>
  );
}
