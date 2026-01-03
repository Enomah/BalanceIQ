"use client";

import Dashboard from "@/components/dashboard/Dashboard";
import { useRequireAuth } from "@/lib/useRequireAuth";

export default function DashboardPage() {
  useRequireAuth();
  return <Dashboard />;
}
