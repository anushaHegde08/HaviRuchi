"use client";

import { UnexpectedError } from "@/components/error-screens/UnexpectedError";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <UnexpectedError error={error} reset={reset} />;
}
