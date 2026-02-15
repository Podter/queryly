import type { PropsWithChildren } from "react";
import { Moon, SettingsIcon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";

interface SettingsProps {
  className?: string;
}

export default function Settings({ className }: SettingsProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className={className} variant="ghost" size="icon">
          <SettingsIcon />
          <span className="sr-only">Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-screen border-none sm:w-[26rem] sm:max-w-none sm:border-l sm:border-solid">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-4 py-4">
          <SettingItem
            label="Theme"
            description="Toggle between light and dark mode"
          >
            <ThemeToggle />
          </SettingItem>
          <SettingItem
            label="Expanded AI Overviews"
            description="Expand AI Overviews by default"
          >
            <ExpandAIOverviews />
          </SettingItem>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface SettingItemProps {
  label: string;
  description: string;
}

function SettingItem({
  label,
  description,
  children,
}: PropsWithChildren<SettingItemProps>) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="space-y-0.5">
        <span className="text-sm font-medium leading-none">{label}</span>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

function ThemeToggle() {
  const toggleTheme = useCallback(() => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export const AI_OVERVIEWS_KEY = "expanded-ai-overviews";

function ExpandAIOverviews() {
  const [open, _setOpen] = useState(false);

  const setOpen = useCallback((open: boolean) => {
    _setOpen(open);
    localStorage.setItem(AI_OVERVIEWS_KEY, open.toString());
  }, []);

  useEffect(() => {
    const value = localStorage.getItem(AI_OVERVIEWS_KEY);
    if (value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      _setOpen(value === "true");
    }
  }, []);

  return <Switch checked={open} onCheckedChange={setOpen} />;
}
