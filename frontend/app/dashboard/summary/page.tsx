import SummaryPage from "@/components/summary/SummaryPage";
import React, { Suspense } from "react";

export default function SummaryDashboardPage() {
  return (
    <Suspense fallback={null}>
      <SummaryPage />
    </Suspense>
  );
}
