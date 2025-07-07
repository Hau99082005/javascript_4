"use client";
import { SessionProvider } from "next-auth/react";
import ThemeProvider from "./ThemeProvider";
import { Provider } from "react-redux";
import { store } from "./store";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  );
} 