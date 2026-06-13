"use client";

import ButtonLoadingSpinner from "@/components/loading/ButtonLoadingSpinner";
import { PageOverlay } from "@/components/loading/PageOverlay";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRecipes } from "@/hooks/useRecipes";
import { uploadImage } from "@/lib/uploadImage";
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
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { LoadingScreen } from "../loading/LoadingScreen";

const UserProfile = () => {
  const { data: session } = useSession();

  const router = useRouter();
  const { favoriteRecipes, loading, setLoading } = useRecipes();

  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phone, setPhone] = useState("");
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [imageError, setImageError] = useState(false);

  const [profileData, setProfileData] = useState({
    image: "",
    phone: "",
  });
  const [profileLoading, setProfileLoading] = useState(true);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingPhone, setSavingPhone] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const [myRecipesCount, setMyRecipesCount] = useState(0);

  useEffect(() => {
    const fetchMyRecipesCount = async () => {
      const response = await fetch("/api/recipes/my-recipes");
      const data = await response.json();
      if (Array.isArray(data)) setMyRecipesCount(data.length);
    };
    fetchMyRecipesCount();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("fetching profile...");

        const response = await fetch("/api/users/profile");
        console.log("profile response status:", response.status);
        if (profileLoading) return <LoadingScreen />;

        const data = await response.json();
        if (response.ok) {
          setProfileData({ image: data.image || "", phone: data.phone || "" });
          setPhone(data.phone || "");
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setProfileLoading(false);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [profileLoading, setLoading]);

  const currentImage =
    profileData.image || preview || session?.user?.image || undefined;

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "U";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError(false);
    // validate size
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    // validate type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG and WebP images are allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    try {
      setUploadingImage(true);
      // upload to Cloudinary
      const url = await uploadImage(file, "profiles");
      console.log("Profile image uploaded:", url);
      await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: url }),
      });
      setProfileData((prev) => ({ ...prev, image: url }));
      setPreview(null);
      toast.success("Profile photo updated!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      toast.error(message || "Upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSavePhone = async () => {
    if (!phoneInput.trim()) return;
    try {
      setSavingPhone(true);
      await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneInput }),
      });

      setPhone(phoneInput);
      setProfileData((prev) => ({ ...prev, phone: phoneInput }));
      setEditingPhone(false);
      toast.success("Phone number saved!");
    } catch (error) {
      toast.error("Failed to save phone number");
      console.error("Failed to save phone number", error);
    } finally {
      setSavingPhone(false);
    }
  };

  const handleCancelPhone = () => {
    setPhoneInput(phone);
    setEditingPhone(false);
  };

  const handleLogout = async () => {
    let isNavigating = false;
    try {
      setLoggingOut(true);
      await signOut({ callbackUrl: "/screens/sign-in" });
      isNavigating = true;
    } finally {
      if (!isNavigating) {
        setLoggingOut(false);
      }
    }
  };

  const handleDeleteAccount = async () => {
    let isNavigating = false;
    try {
      setDeletingAccount(true);
      const response = await fetch("/api/users/profile", {
        method: "DELETE",
      });

      if (!response.ok) {
        toast.error("Failed to delete account");
        setDeletingAccount(false);
        return;
      }

      toast.success("Account deleted successfully");
      await signOut({ callbackUrl: "/screens/sign-up" });
      isNavigating = true;
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Failed to delete account", error);
    } finally {
      if (!isNavigating) {
        setDeletingAccount(false);
      }
    }
  };

  const activityItems = [
    {
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      label: "My Recipes",
      description: `${myRecipesCount} recipes added`,
      onClick: () => router.push("/screens/my-recipes"),
    },
    {
      icon: <Heart className="h-5 w-5 text-primary" />,
      label: "My Favorites",
      description: `${favoriteRecipes.length} favorite recipes`,
      onClick: () => router.push("/screens/favorites"),
    },
  ];

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="min-h-screen bg-background px-4 py-6 md:py-12">
          <PageOverlay
            show={
              uploadingImage || savingPhone || loggingOut || deletingAccount
            }
          />
          <div className="flex flex-col gap-6 w-full md:max-w-2xl md:mx-auto mb-10 md:mb-0">
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
                  <AvatarFallback className="bg-primary/20 text-primary text-3xl">
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
                  {uploadingImage ? (
                    <span className="block h-3 w-3 md:h-5 md:w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : preview ? (
                    <Pencil className="block h-3 w-3 md:h-5 md:w-5 text-white" />
                  ) : (
                    <Camera className="block h-3 w-3 md:h-5 md:w-5 text-white" />
                  )}
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col md:items-center">
                <span className="truncate text-base font-bold sm:text-lg md:text-2xl">
                  {session?.user?.name ?? "User"}
                </span>
                <span className="max-w-full break-all text-xs text-muted-foreground sm:text-base md:text-lg md:text-center">
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
                <div className="flex items-start gap-4 p-4">
                  <div className="bg-primary/10 rounded-full p-2 shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-xs text-muted-foreground">
                      Phone Number
                    </span>
                    {editingPhone ? (
                      // editing mode
                      <div className="mt-1 flex min-w-0 items-center gap-2 overflow-hidden">
                        <input
                          type="tel"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="+91 94481 00000"
                          autoFocus
                          className="min-w-0 flex-1 border-b border-primary py-0.5 text-sm outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleSavePhone}
                          disabled={savingPhone}
                          className="shrink-0"
                        >
                          {savingPhone ? (
                            <span className="inline-block h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                          ) : (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelPhone}
                          className="shrink-0"
                        >
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
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full rounded-xl h-12 gap-2"
            >
              {loggingOut ? (
                <ButtonLoadingSpinner loadingText="Logging out..." />
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  Logout
                </>
              )}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full rounded-xl h-12 border-destructive text-destructive hover:bg-destructive/5"
                >
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your account, all your recipes
                    and favorites. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {deletingAccount ? (
                      <ButtonLoadingSpinner loadingText="Deleting..." />
                    ) : (
                      "Delete Account"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
