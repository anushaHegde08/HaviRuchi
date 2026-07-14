import { AppShell } from "@/components/layout/AppShell";

export default function ScreensLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
