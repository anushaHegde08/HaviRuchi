"use client";
import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { IconInput } from "@/components/auth/IconInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordRules } from "@/components/auth/PasswordRules";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SignUpPage() {
  const { status } = useSession();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    general: "", // for server errors
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
    // if (!name || !email || !password) {
    //   toast.error("Please fill in all fields");
    //   return;
    // }
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
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        // API returned an error (400, 500 etc)
        // server errors — show inline on relevant field
        if (data.error.includes("email")) {
          setErrors((prev) => ({ ...prev, email: data.error }));
        } else {
          setErrors((prev) => ({ ...prev, general: data.error }));
        }
        return;
      }
      // success
      toast.success("Account created successfully!");
      router.push("/screens/sign-in");
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: "Something went wrong. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

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
          onChange={setName}
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
          onChange={setEmail}
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
          onChange={setPassword}
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
        {loading ? "Creating account..." : "Sign Up"}
      </Button>
    </AuthLayout>
  );
}
