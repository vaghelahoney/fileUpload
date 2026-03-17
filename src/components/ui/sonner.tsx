"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      className="toaster group"
      style={
        {
          


          // SUCCESS (GREEN)
          "--success-bg": "#ecfdf5",
          "--success-text": "#059669",
          "--success-border": "#a7f3d0",

          // ERROR (RED)
          "--error-bg": "#fef2f2",
          "--error-text": "#dc2626",
          "--error-border": "#fecaca",

          // WARNING (YELLOW)
          "--warning-bg": "#fffbeb",
          "--warning-text": "#d97706",
          "--warning-border": "#fde68a",

          // INFO (BLUE)
          "--info-bg": "#eff6ff",
          "--info-text": "#2563eb",
          "--info-border": "#bfdbfe",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
