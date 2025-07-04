"use client";
import React from "react";
import ThemeSwitcher from "./ThemeSwitcher";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState("theme-light");

  React.useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <>
      <ThemeSwitcher onChange={setTheme} />
      {children}
    </>
  );
} 