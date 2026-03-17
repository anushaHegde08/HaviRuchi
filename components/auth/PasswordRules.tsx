import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { RULES } from "@/mockData/constatnts";

export const PasswordRules = ({ password }: { password: string }) => (
  <div className="flex flex-col gap-2">
    <p className="text-sm font-semibold">Your Password must contain:</p>
    {RULES.map((rule) => {
      const passed = rule.test(password);
      return (
        <div key={rule.label} className="flex items-center gap-2">
          <div
            className={cn(
              "rounded-full p-0.5",
              passed
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground",
            )}
          >
            <Check className="h-3 w-3" />
          </div>
          <span
            className={cn(
              "text-sm",
              passed ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {rule.label}
          </span>
        </div>
      );
    })}
  </div>
);
