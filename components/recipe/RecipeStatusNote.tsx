"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { MessageSquareWarning, X } from "lucide-react";
import { useState } from "react";

interface RecipeStatusNoteProps {
  status: string;
  reviewNote?: string;
}

export function RecipeStatusNote({
  status,
  reviewNote,
}: RecipeStatusNoteProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!status) return null;

  return (
    <div className="my-1 flex flex-col gap-2 items-start">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-[10px] md:text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold",
            status === "pending" && "bg-amber-100 text-amber-700",
            status === "approved" && "bg-green-100 text-green-700",
            status === "rejected" && "bg-red-100 text-red-700",
          )}
        >
          {status}
        </span>
        {status !== "approved" && reviewNote && (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <button
                className="text-red-500 hover:bg-red-50 p-1 rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(true);
                }}
              >
                <MessageSquareWarning className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 max-w-sm p-4 relative shadow-lg border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="absolute right-3 top-3 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Close</span>
              </button>
              <div className="flex flex-col gap-2 pr-4">
                <h4 className="text-sm font-semibold leading-none text-foreground">
                  Admin&apos;s Note
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                  {reviewNote}
                </p>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
