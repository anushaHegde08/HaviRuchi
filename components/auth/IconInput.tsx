import { Input } from "@/components/ui/input";
import React, { DetailedHTMLProps, InputHTMLAttributes } from "react";

interface IconInputProps {
  id: string;
  type?: string;
  placeholder?: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  inputProps?: Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "ref"
  >;
}

export const IconInput = ({
  id,
  type = "text",
  placeholder,
  icon,
  value,
  onChange,
  inputProps,
}: IconInputProps) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
      {icon}
    </div>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="pl-9 rounded-xl h-12"
      {...inputProps}
    />
  </div>
);
