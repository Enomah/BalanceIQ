"use client";

import React from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import { useAuthStore } from "@/store/authStore";
import { useRequireAuth } from "@/lib/useRequireAuth";
import ShoppingListManager from "@/components/shopping-list/ShoppingListManager";
import { ShoppingCart } from "lucide-react";

export default function ShoppingListPage() {
  const { userProfile } = useAuthStore();
  useRequireAuth();

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      <Sidebar
        currentPath="/dashboard/shopping-list"
        userProfile={userProfile}
      />

      <div className="flex-1 sm:overflow-y-auto">
        <div className="mx-auto">
          <div className="sticky z-[100] top-0 left-0">
            <WelcomeSection userProfile={userProfile} />
          </div>

          <div className="max-w-6xl mx-auto px-[10px] sm:px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <ShoppingCart className="text-[var(--brand-primary)]" />
                  Shopping Lists
                </h1>
                <p className="text-[var(--text-secondary)] mt-1">
                  Create and manage your shopping lists with ease
                </p>
              </div>
            </div>

            <ShoppingListManager />
          </div>
        </div>
      </div>
    </div>
  );
}
