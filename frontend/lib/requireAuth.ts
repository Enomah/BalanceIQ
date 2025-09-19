"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function requireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, isSignedIn, userProfile, hydrateFromCookies } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    hydrateFromCookies();
    setIsHydrated(true);
  }, [hydrateFromCookies]);

  useEffect(() => {
    if (isHydrated && !accessToken && !isSignedIn && !userProfile) {
      const encodedPath = encodeURIComponent(pathname);
      router.push(`/login?redirect=${encodedPath}`);
    }
  }, [isHydrated, accessToken, isSignedIn, userProfile, router, pathname]);
}
