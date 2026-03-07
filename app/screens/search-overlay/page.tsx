"use client";
import SearchBar from "@/components/discover/SearchBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { useGlobalContext } from "@/context";
import { Search, X } from "lucide-react";
import React from "react";

const SearchOverlay = () => {
  const { searchOpen, setSearchOpen } = useGlobalContext();
  if (!searchOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-white/40 backdrop-blur-sm z-40"
        onClick={() => setSearchOpen(false)}
      ></div>
      <div className="fixed top-20 z-50 w-5/12">
        <Card className="flex flex-col items-start bg-white border-primary p-4 gap-2">
          <div className="flex w-full items-center justify-between">
            <Typography variant="body" color="primary">
              Discover Recipes
            </Typography>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-transparent hover:scale-125 transition-transform"
              onClick={() => setSearchOpen(false)}
            >
              <X />
            </Button>
          </div>
          <SearchBar />
        </Card>
      </div>
    </>
  );
};

export default SearchOverlay;
