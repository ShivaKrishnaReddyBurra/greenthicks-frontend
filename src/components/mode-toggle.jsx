"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const LeafLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="leafbase">
        <div className="lf">
          <div className="leaf1">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf2">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf3">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="tail"></div>
        </div>
      </div>
    </div>
  );
};

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleThemeChange = async (newTheme) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Ensure loader shows for 1 second
    setTheme(newTheme);
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LeafLoader />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleThemeChange("light")}>Light</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("dark")}>Dark</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("system")}>System</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}