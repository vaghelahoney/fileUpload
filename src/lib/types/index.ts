import { LucideIcon } from "lucide-react";

export type Route = {
  url: () => string;
  label: string;
  icon: LucideIcon;
};

export type Routes<T extends string> = Record<T, Route>;