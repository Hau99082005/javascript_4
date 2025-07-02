"use client";
import React from "react";
import ThemeSwitcher from "./ThemeSwitcher";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState("theme-light");

  return (
    <body className={theme}>
      <ThemeSwitcher onChange={setTheme} />
      {children}
    </body>
  );
} 