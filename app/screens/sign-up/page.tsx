"use client";
import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { IconInput } from "@/components/auth/IconInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordRules } from "@/components/auth/PasswordRules";

export default function SignUpPage() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSignUpClick = () => {
    console.log("handleSignUpClick");
  };
  return (
    <AuthLayout
      title="Welcome!"
      subtitle="Sign up to discover and save authentic Havyaka recipes."
      footerText="Already have an account?"
      footerLinkText="Sign In"
      footerLinkHref="/auth/sign-in"
    >
      <IconInput
        id="name"
        type="text"
        placeholder="Name"
        icon={<User className="h-4 w-4" />}
        value={name}
        onChange={setName}
        inputProps={{ required: true }}
      />
      <IconInput
        id="email"
        type="email"
        placeholder="Email Address"
        icon={<Mail className="h-4 w-4" />}
        value={email}
        onChange={setEmail}
        inputProps={{ required: true }}
      />
      <IconInput
        id="phone"
        type="phoneNumber"
        placeholder="Phone Number(optional)"
        icon={<Phone className="h-4 w-4" />}
        value={phoneNumber}
        onChange={setPhoneNumber}
      />
      <PasswordInput
        id="password"
        placeholder="Password"
        onChange={setPassword}
      />
      <PasswordRules password={password} />
      <Button
        className="w-full h-12 rounded-xl"
        type="submit"
        onClick={handleSignUpClick}
      >
        Sign Up
      </Button>
    </AuthLayout>
  );
}
