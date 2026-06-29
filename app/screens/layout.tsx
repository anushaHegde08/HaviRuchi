import { Navbar } from "@/components/navbar/Navbar";
import { Toaster } from "sonner";

export default function ScreensLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <main>{children}</main>
      <Toaster
        position="top-center"
        duration={3000}
        closeButton={true}
        toastOptions={{
          classNames: {
            icon: "text-primary",
            closeButton: "!left-auto !right-2 !top-1/2 !-translate-y-1/2",
          },
        }}
      />
    </div>
  );
}
