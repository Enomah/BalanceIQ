"use client";

import { baseUrl } from "@/api/rootUrls";
import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";
import { useGoalStore } from "@/store/goalsStore";
import { Goal } from "@/types/dashboardTypes";
import { motion } from "framer-motion";
import { Target, TrendingUp, AlertCircle, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Props {
  goals: Goal[];
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<any>;
  bg: string;
  color: string;
}

export default function GoalsStats({  }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { userProfile, accessToken } = useAuthStore();
  const { stats, setStats } = useGoalStore();

  const fetchStats = useCallback(async () => {
    if (stats.totalGoals > 0) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${baseUrl}/dashboard/goals/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch goals stats: ${res.status}`);
      }

      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching goals stats:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load goals statistics"
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken, stats.totalGoals, setStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleRetry = () => {
    fetchStats();
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)] p-6 mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-[var(--error-500)]" />
            <div>
              <p className="text-[var(--text-primary)] font-medium">
                Failed to load statistics
              </p>
              <p className="text-[var(--text-secondary)] text-sm mt-1">
                {error}
              </p>
            </div>
          </div>
          <button
            onClick={handleRetry}
            className="flex items-center space-x-2 px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-dark)] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      </motion.div>
    );
  }

  if (loading && stats.totalGoals === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      <StatCard
        label="Total Goals"
        value={stats.totalGoals}
        icon={Target}
        bg="var(--primary-100)"
        color="var(--brand-primary)"
      />

      <StatCard
        label="Active Goals"
        value={stats.totalActive}
        icon={TrendingUp}
        bg="var(--success-100)"
        color="var(--success-600)"
      />

      <StatCard
        label="Total Target"
        value={formatCurrency(stats.totalTarget, userProfile?.currency || "")}
        icon={Target}
        bg="var(--warning-100)"
        color="var(--warning-600)"
      />

      <StatCard
        label="Total Saved"
        value={formatCurrency(stats.totalSaved, userProfile?.currency || "")}
        icon={TrendingUp}
        bg="var(--primary-100)"
        color="var(--brand-primary)"
      />
    </motion.div>
  );
}

function StatCard({ label, value, icon: Icon, bg, color }: StatCardProps) {
  return (
    <div className="bg-[var(--bg-secondary)] p-[10px] sm:p-6 rounded-lg sm:rounded-xl border border-[var(--border-light)] shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[var(--text-secondary)] text-sm font-medium">
            {label}
          </p>
          <p className="sm:text-2xl text-[18px] font-bold text-[var(--text-primary)] mt-1">
            {value}
          </p>
        </div>
        <div
          className={`p-[5px] sm:p-3 rounded-lg`}
          style={{ backgroundColor: bg }}
        >
          <Icon className={`w-6 h-6`} style={{ color }} />
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-[var(--bg-secondary)] p-[10px] sm:p-6 rounded-lg border border-[var(--border-light)]"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-[var(--bg-tertiary)] rounded w-20 animate-pulse" />
              <div className="h-8 bg-[var(--bg-tertiary)] rounded w-16 animate-pulse" />
            </div>
            <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-lg animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
