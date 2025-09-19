import React from "react";
import {
  ArrowRight,
  Play,
  Shield,
  TrendingUp,
  DollarSign,
  Calendar,
  Target,
  PieChart,
} from "lucide-react";
import Link from "next/link";

const statsData = [
  {
    id: "income",
    label: "Income",
    value: "$4,250",
    change: "+$320 from last month",
    icon: TrendingUp,
    bgGradient: "from-[var(--success-50)] to-[var(--success-100)]",
    borderColor: "border-[var(--success-200)]",
    textColor: "text-[var(--success-700)]",
    iconBg: "bg-[var(--success-200)]",
    iconColor: "text-[var(--success-700)]",
  },
  {
    id: "expenses",
    label: "Expenses",
    value: "$2,480",
    change: "-$140 from last month",
    icon: TrendingUp,
    iconRotation: "transform rotate-180",
    bgGradient: "from-[var(--error-50)] to-[var(--error-100)]",
    borderColor: "border-[var(--error-200)]",
    textColor: "text-[var(--error-700)]",
    iconBg: "bg-[var(--error-200)]",
    iconColor: "text-[var(--error-700)]",
  },
  {
    id: "savings",
    label: "Savings",
    value: "$1,240",
    change: "29% of income",
    icon: Target,
    bgGradient: "from-[var(--primary-50)] to-[var(--primary-100)]",
    borderColor: "border-[var(--primary-200)]",
    textColor: "text-[var(--primary-700)]",
    iconBg: "bg-[var(--primary-200)]",
    iconColor: "text-[var(--primary-700)]",
  },
  {
    id: "investments",
    label: "Investments",
    value: "$3,570",
    change: "+4.2% this month",
    icon: PieChart,
    bgGradient: "from-[var(--warning-50)] to-[var(--warning-100)]",
    borderColor: "border-[var(--warning-200)]",
    textColor: "text-[var(--warning-700)]",
    iconBg: "bg-[var(--warning-200)]",
    iconColor: "text-[var(--warning-700)]",
  },
];

const progressData = [
  {
    id: "savings-goal",
    title: "Savings Goal Progress",
    value: "65%",
    current: "$2,500 saved",
    target: "$3,850 target",
    icon: Target,
    progressWidth: "65%",
    iconColor: "text-[var(--primary-500)]",
    valueColor: "text-[var(--primary-600)]",
  },
  {
    id: "monthly-budget",
    title: "Monthly Budget",
    value: "$820 remaining",
    current: "Spent: $1,680 of $2,500",
    target: "67% utilized",
    progressWidth: "67%",
    valueColor: "text-[var(--success-500)]",
  },
];

const footerActions = [
  {
    id: "view-report",
    label: "View Detailed Report",
    disabled: true,
  },
  {
    id: "export-data",
    label: "Export Data",
    disabled: true,
  },
];

const Hero = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="mx-auto max-w-6xl">
        <div
          className={`flex flex-col md:flex-row items-center ${
            isVisible ? "animate-fade-in" : "opacity-0"
          }`}
        >
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white  mb-6 leading-tight">
              Take Control of Your{" "}
              <span className="text-[var(--primary-500)]">
                Financial Future
              </span>
            </h1>
            <p className="text-xl text-white/70 mb-8">
              Take control of your finances with BalanceIQ — track, save, and
              grow smarter with personalized insights.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href={"/dashboard"}
                className="px-6 py-3 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-700)] transition-colors flex items-center justify-center text-lg font-medium"
              >
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="mt-8 flex items-center space-x-2 text-[var(--text-secondary)]">
              <Shield className="h-5 w-5 text-[var(--success-500)]" />
              <span>Bank-level security & encryption</span>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
};

export const DashboardPreview = () => {
  return (
    <div className="relative group">
      <div className="absolute -inset-8 bg-[var(--primary-500)] rounded-3xl opacity-10 blur-xl group-hover:opacity-15 transition-opacity duration-300"></div>

      <div className="relative bg-[var(--card-bg)] rounded-2xl shadow-lg p-[15px] border border-[var(--border-light)] transition-all duration-300 group-hover:shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="p-2 bg-[var(--primary-100)] rounded-lg mr-3">
              <DollarSign className="h-5 w-5 text-[var(--primary-600)]" />
            </div>
            <h3 className="font-semibold text-xl text-[var(--text-primary)]">
              Financial Overview Demo
            </h3>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center text-sm text-[var(--text-secondary)]">
              <Calendar className="h-[15px] w-[15px] mr-1" />
              <span>August 2023</span>
            </div>
            <div className="text-lg text-[var(--success-500)] font-medium flex items-center">
              <TrendingUp className="h-5 w-5 mr-1" /> +12.5%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-[10px] md:gap-6 mb-8">
          {statsData.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.id}
                className={`bg-gradient-to-br ${stat.bgGradient} p-[5px] rounded-xl border ${stat.borderColor}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`${stat.textColor} text-sm font-medium`}>
                    {stat.label}
                  </div>
                  <div className={`p-[2px] ${stat.iconBg} rounded-md`}>
                    <IconComponent
                      className={`h-[15px] w-[15px] ${stat.iconColor} ${stat.iconRotation || ""}`}
                    />
                  </div>
                </div>
                <div className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </div>
                <div className={`text-xs ${stat.textColor} mt-1 opacity-80`}>
                  {stat.change}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {progressData.map((progress, index) => (
            <div key={progress.id}>
              <div className="flex justify-between items-center mb-4">
                <div className="text-[var(--text-primary)] font-medium flex items-center">
                  {progress.icon && (
                    <progress.icon
                      className={`h-[15px] w-[15px] mr-2 ${progress.iconColor || "text-[var(--primary-500)]"}`}
                    />
                  )}
                  {progress.title}
                </div>
                <span className={`font-semibold ${progress.valueColor}`}>
                  {progress.value}
                </span>
              </div>
              
              {progress.id === "savings-goal" ? (
                <>
                  <div className="w-full bg-[var(--border-light)] rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-[var(--primary-400)] to-[var(--primary-600)] h-3 rounded-full transition-all duration-700 ease-out"
                      style={{ width: progress.progressWidth }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span>{progress.current}</span>
                    <span>{progress.target}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between px-3 py-2 bg-[var(--bg-tertiary)] rounded-lg">
                    <div className="text-sm text-[var(--text-secondary)]">
                      {progress.current}
                    </div>
                    <div className="text-xs px-2 py-1 bg-[var(--success-100)] text-[var(--success-700)] rounded-md">
                      {progress.target}
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <div className="flex-1 bg-[var(--success-300)] h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[var(--success-500)] h-2 rounded-full" 
                        style={{ width: progress.progressWidth }}
                      ></div>
                    </div>
                    <div className="flex-1 bg-[var(--primary-300)] h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[var(--primary-500)] h-2 rounded-full" 
                        style={{ width: "33%" }}
                      ></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--border-light)] flex justify-between">
          {footerActions.map((action) => (
            <button
              key={action.id}
              disabled={action.disabled}
              className={`px-4 py-2 ${
                action.id === "view-report"
                  ? "text-sm text-[var(--primary-600)]/60 cursor-not-allowed font-medium transition-colors"
                  : "bg-[var(--primary-500)]/60 cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;