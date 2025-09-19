"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { useAuthStore } from "@/store/authStore";
import React, { useEffect } from "react";

interface Childprops {
  children: React.ReactNode;
}

export default function GeneralAppProvider({ children }: Childprops) {
  const { hydrateFromCookies } = useAuthStore();

  useEffect(() => {
    hydrateFromCookies();
  }, [hydrateFromCookies]);

  return <ThemeProvider>{children}</ThemeProvider>;
}
