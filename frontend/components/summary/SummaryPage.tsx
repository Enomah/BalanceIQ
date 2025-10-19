"use client";

import { baseUrl } from "@/api/rootUrls";
import { useAuthStore } from "@/store/authStore";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../sidebar/Sidebar";
import WelcomeSection from "../dashboard/WelcomeSection";
import ControlsSection from "./ControlsSection";
import MainCharts from "./main-charts/MainCharts";
import SecondaryCharts from "./secondary-charts/SecondaryCharts";
import TransactionHighlights from "./TransactionHighlights";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";
import { SummaryData, MonthYearOption } from "@/types/summaryTypes";
import OverviewCards from "./OverviewCards";
import { requireAuth } from "@/lib/requireAuth";
import { Calendar } from "lucide-react";

export default function SummaryPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const { accessToken, userProfile } = useAuthStore();
  const searchParams = useSearchParams();
  const monthParam = searchParams.get("month");
  const yearParam = searchParams.get("year");
  requireAuth();

  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [monthYearOptions, setMonthYearOptions] = useState<MonthYearOption[]>(
    []
  );
  const [selectedMonthYear, setSelectedMonthYear] = useState<string>("");

  const generateMonthYearOptions = useCallback(() => {
    if (!userProfile?.createdAt) {
      console.log("No user creation date found");
      return [];
    }

    const options: MonthYearOption[] = [];

    const startDate = new Date(userProfile.createdAt);
    const endDate = new Date();

    const normalizeDate = (date: Date) => {
      const normalized = new Date(date);
      normalized.setDate(1);
      normalized.setHours(12, 0, 0, 0);
      return normalized;
    };

    const normalizedStart = normalizeDate(startDate);
    const normalizedEnd = normalizeDate(endDate);

    let currentDate = new Date(normalizedStart);

    while (currentDate <= normalizedEnd) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const value = `${year}-${month.toString().padStart(2, "0")}`;
      const label = `${currentDate.toLocaleString("default", {
        month: "long",
      })} ${year}`;

      const isCurrent =
        currentDate.getFullYear() === normalizedEnd.getFullYear() &&
        currentDate.getMonth() === normalizedEnd.getMonth();

      const option: MonthYearOption = {
        value,
        label,
        year,
        month,
        isCurrent,
      };

      options.push(option);

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    const reversedOptions = options.reverse();
    return reversedOptions;
  }, [userProfile?.createdAt]);

  useEffect(() => {
    const options = generateMonthYearOptions();
    setMonthYearOptions(options);

    if (options.length > 0 && !selectedMonthYear) {
      const currentMonth = options.find((opt) => opt.isCurrent) || options[0];

      setSelectedMonthYear(currentMonth.value);
    }
  }, [generateMonthYearOptions, selectedMonthYear]);

  const [selectedYear, selectedMonth] = selectedMonthYear
    .split("-")
    .map(Number);

  const fetchData = useCallback(async () => {
    if (!selectedMonth || !selectedYear) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${baseUrl}/dashboard/summary?month=${selectedMonth}&year=${selectedYear}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch data: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();

      if (data.success && data.summary) {
        setSummaryData(data.summary);
      } else {
        throw new Error(
          data.message || "Invalid data format received from server"
        );
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while fetching data"
      );
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, accessToken]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchData();
    }
  }, [fetchData, selectedMonth, selectedYear]);

  useEffect(() => {
    if (monthParam && yearParam) {
      const urlMonthYear = `${yearParam}-${monthParam.padStart(2, "0")}`;
      setSelectedMonthYear(urlMonthYear);

      // console.log(urlMonthYear, selectedMonthYear);

      // if (urlMonthYear !== selectedMonthYear) {
      //   // Check if this month-year exists in our options
      //   const isValidOption = monthYearOptions.some(
      //     (opt) => opt.value === urlMonthYear
      //   );

      //   console.log("is valid:", monthYearOptions);
      //   if (isValidOption) {
      //     console.log("url month year:", urlMonthYear);
      //     setSelectedMonthYear(urlMonthYear);
      //   } else {
      //     console.log("is not valid");
      //   }
      // }
    }
  }, []);

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      <Sidebar
        currentPath={"/dashboard/summary"}
        userProfile={userProfile}
      />

      <div className="flex-1 sm:overflow-y-auto">
        <div className="mx-auto">
          <div className="sticky z-[100] top-0 left-0">
            <WelcomeSection userProfile={userProfile} />
          </div>

          <div className="px-[10px] sm:px-6 pb-[20px] flex flex-col gap-[20px]">
            <ControlsSection
              monthYearOptions={monthYearOptions}
              selectedMonthYear={selectedMonthYear}
              setSelectedMonthYear={setSelectedMonthYear}
              loading={loading}
              fetchData={fetchData}
              userCreatedAt={userProfile?.createdAt}
            />

            {error ? (
              <ErrorState error={error} fetchData={fetchData} />
            ) : loading ? (
              <LoadingState />
            ) : !monthYearOptions.length ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-[var(--text-tertiary)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  No Data Available
                </h3>
                <p className="text-[var(--text-secondary)]">
                  We need more transaction data to generate your financial
                  summary.
                </p>
              </div>
            ) : summaryData ? (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <OverviewCards summaryData={summaryData} />
                  <MainCharts summaryData={summaryData} />
                  <SecondaryCharts summaryData={summaryData} />
                  <TransactionHighlights summaryData={summaryData} />
                </motion.div>
              </AnimatePresence>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
