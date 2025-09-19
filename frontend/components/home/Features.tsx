import React from "react";
import {
  CreditCard,
  Goal,
  PieChart,
  Bell,
  Shield,
  TrendingUp,
} from "lucide-react";

const Features = ({
  featuresRef,
}: {
  featuresRef: React.RefObject<HTMLElement>;
}) => {
  const features = [
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Track Income & Expenses",
      description:
        "Log and categorize your income and spending to see exactly where your money goes.",
    },
    {
      icon: <Goal className="h-8 w-8" />,
      title: "Savings Goals",
      description:
        "Create custom savings targets and watch your progress grow with visual trackers.",
    },
    {
      icon: <PieChart className="h-8 w-8" />,
      title: "Dashboards & Reports",
      description:
        "View your financial health at a glance with clear charts and monthly summaries.",
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: "Smart Alerts",
      description:
        "Get reminders for bills and notifications when you're close to overspending.",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Personalized Insights",
      description:
        "Receive actionable tips like 'Cut dining by 10% to save $100 more this month.'",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Private",
      description:
        "Bank-level encryption ensures your financial data is safe and private.",
    },
  ];

  return (
    <section ref={featuresRef} className="py-20 bg-[var(--bg-secondary)] px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-on-scroll opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Everything You Need for{" "}
            <span className="text-[var(--primary-500)]">Financial Success</span>
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
            BalanceIQ provides all the tools you need to take control of your
            finances and build a secure financial future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({
  feature,
  index,
}: {
  feature: { icon: React.ReactNode; title: string; description: string };
  index: number;
}) => {
  return (
    <div
      className="animate-on-scroll opacity-0 bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-tertiary)] p-6 rounded-2xl border border-[var(--border-light)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-14 h-14 bg-[var(--primary-500)] rounded-xl flex items-center justify-center text-white mb-4">
        {feature.icon}
      </div>
      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
        {feature.title}
      </h3>
      <p className="text-[var(--text-secondary)]">{feature.description}</p>
    </div>
  );
};

export default Features;
