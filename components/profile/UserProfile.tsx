"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  BookOpen,
  Camera,
  ChevronRight,
  Heart,
  LogOut,
  Mail,
  Phone,
} from "lucide-react";

const contactInfo = [
  {
    icon: <Mail className="h-5 w-5 text-primary" />,
    label: "Email Address",
    value: "ganesh.chef@havyaka.in",
  },
  {
    icon: <Phone className="h-5 w-5 text-primary" />,
    label: "Phone Number",
    value: false ? "+91 94481 00000" : "Add Phone Number",
  },
];

const activityItems = [
  {
    icon: <BookOpen className="h-5 w-5 text-primary" />,
    label: "My Recipes",
    description: "24 recipes added",
  },
  {
    icon: <Heart className="h-5 w-5 text-primary" />,
    label: "My Favorites",
    description: "112 favorite recipes",
  },
];

const UserProfile = () => {
  return (
    <div className="min-h-screen bg-background px-4 py-6 md:py-12">
      <div className="flex flex-col gap-6 w-full md:max-w-2xl md:mx-auto">
        {/* ── Avatar + Name ── */}
        {/* mobile: horizontal card | desktop: centered column */}
        <Card className="p-4 flex items-center gap-4 md:flex-col md:items-center md:py-8 md:gap-3">
          <div className="relative shrink-0">
            <Avatar className="w-16 h-16 md:w-28 md:h-28">
              <AvatarImage src="/images/profile.png" alt="Ganesh Bhat" />
              <AvatarFallback>GB</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 md:bottom-1 md:right-1 bg-primary rounded-full p-1.5 cursor-pointer hover:bg-primary/90 transition-colors">
              <Camera className="h-3 w-3 md:h-5 md:w-5 text-white" />
            </div>
          </div>
          <div className="flex flex-col md:items-center">
            <span className="text-lg font-bold md:text-2xl">Ganesh Bhat</span>
            <span className="text-sm text-muted-foreground">
              ganesh.chef@havyaka.in
            </span>
          </div>
        </Card>

        {/* ── Contact Information ── */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase text-muted-foreground tracking-widest">
            Contact Information
          </span>
          <Card className="divide-y">
            {contactInfo.map((item) => (
              <div key={item.label} className="flex items-center gap-4 p-4">
                <div className="bg-primary/10 rounded-full p-2 shrink-0">
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>

                  <span className="text-sm font-medium">
                    {item.value === "Add Phone Number" ? (
                      <span className="flex flex-row gap-0 text-primary">
                        {item.value}
                        <ArrowRight className="text-primary h-5 w-5" />
                      </span>
                    ) : (
                      item.value
                    )}
                  </span>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* ── My Activity ── */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase text-muted-foreground tracking-widest">
            My Activity
          </span>
          <div className="flex flex-col gap-3">
            {activityItems.map((item) => (
              <Card
                key={item.label}
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

        {/* ── Logout ── */}
        <Button className="w-full rounded-xl h-12 gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
