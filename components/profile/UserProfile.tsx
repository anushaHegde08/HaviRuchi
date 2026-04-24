"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  BookOpen,
  Camera,
  Check,
  ChevronRight,
  Heart,
  LogOut,
  Mail,
  Pencil,
  Phone,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useRecipes } from "@/hooks/useRecipes";

const UserProfile = ({ existingImage }: { existingImage?: string }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { favoriteRecipes } = useRecipes();

  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phone, setPhone] = useState("");
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [imageError, setImageError] = useState(false);

  const currentImage = preview || session?.user?.image || undefined;

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "U";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError(false);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSavePhone = () => {
    if (!phoneInput.trim()) return;
    setPhone(phoneInput);
    setEditingPhone(false);
    // TODO: save to DB when set up
  };

  const handleCancelPhone = () => {
    setPhoneInput(phone);
    setEditingPhone(false);
  };

  const activityItems = [
    {
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      label: "My Recipes",
      description: "24 recipes added",
      onClick: null,
    },
    {
      icon: <Heart className="h-5 w-5 text-primary" />,
      label: "My Favorites",
      description: `${favoriteRecipes.length} favorite recipes`,
      onClick: () => router.push("/screens/favorites"),
    },
  ];

  return (
    <div className="min-h-screen bg-background px-4 py-6 md:py-12">
      <div className="flex flex-col gap-6 w-full md:max-w-2xl md:mx-auto">
        <Card className="p-4 flex items-center gap-4 md:flex-col md:items-center md:py-8 md:gap-3">
          <div className="relative shrink-0">
            <Avatar className="w-16 h-16 md:w-28 md:h-28">
              {currentImage && !imageError && (
                <AvatarImage
                  src={currentImage}
                  alt={session?.user?.name ?? "User"}
                  onError={() => setImageError(true)}
                />
              )}
              <AvatarFallback className="bg-primary/20 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 md:bottom-1 md:right-1 bg-primary rounded-full p-1.5 cursor-pointer hover:bg-primary/90 transition-colors"
            >
              {preview ? (
                <Pencil className="h-3 w-3 md:h-5 md:w-5 text-white" />
              ) : (
                <Camera className="h-3 w-3 md:h-5 md:w-5 text-white" />
              )}
            </div>
          </div>
          <div className="flex flex-col md:items-center">
            <span className="text-lg font-bold md:text-2xl">
              {session?.user?.name ?? "User"}
            </span>
            <span className="text-sm text-muted-foreground">
              {session?.user?.email ?? ""}
            </span>
          </div>
        </Card>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase text-muted-foreground tracking-widest">
            Contact Information
          </span>
          <Card className="divide-y">
            {/* Email */}
            <div className="flex items-center gap-4 p-4">
              <div className="bg-primary/10 rounded-full p-2 shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  Email Address
                </span>
                <span className="text-sm font-medium">
                  {session?.user?.email}
                </span>
              </div>
            </div>
            {/* Phone */}
            <div className="flex items-center gap-4 p-4">
              <div className="bg-primary/10 rounded-full p-2 shrink-0">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  Phone Number
                </span>
                {editingPhone ? (
                  // editing mode
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="+91 94481 00000"
                      autoFocus
                      className="text-sm border-b border-primary outline-none flex-1 py-0.5"
                    />
                    <button onClick={handleSavePhone}>
                      <Check className="h-4 w-4 text-primary" />
                    </button>
                    <button onClick={handleCancelPhone}>
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                ) : phone ? (
                  // has phone — show with edit
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => {
                      setPhoneInput(phone);
                      setEditingPhone(true);
                    }}
                  >
                    <span className="text-sm font-medium">{phone}</span>
                    <Pencil className="h-3 w-3 text-muted-foreground" />
                  </div>
                ) : (
                  // no phone — show add
                  <span
                    className="flex items-center gap-0 text-sm text-primary cursor-pointer"
                    onClick={() => setEditingPhone(true)}
                  >
                    Add Phone Number
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase text-muted-foreground tracking-widest">
            My Activity
          </span>
          <div className="flex flex-col gap-3">
            {activityItems.map((item) => (
              <Card
                key={item.label}
                onClick={item.onClick ?? undefined}
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="bg-primary/10 rounded-full p-2 shrink-0">
                  {item.icon}
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-bold">{item.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </div>
                <div className="bg-primary/10 rounded-full p-1">
                  <ChevronRight className="h-4 w-4 text-primary" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Button
          onClick={() => signOut({ callbackUrl: "/screens/sign-in" })}
          className="w-full rounded-xl h-12 gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
