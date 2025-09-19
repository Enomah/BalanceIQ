import React from "react";
import { CheckCircle } from "lucide-react";

interface RoadmapStepProps {
  step: {
    phase: string;
    title: string;
    items: string[];
  };
  index: number;
}

const Roadmap = ({
  roadmapRef,
}: {
  roadmapRef: React.RefObject<HTMLElement>;
}) => {
  const roadmapSteps = [
    {
      phase: "Phase 1",
      title: "Getting Started",
      items: [
        "Sign up and create your BalanceIQ account",
        "Set up your profile and preferred currency",
        "Add your first income and expense transactions",
        "Explore your starter dashboard",
      ],
    },
    {
      phase: "Phase 2",
      title: "Building Control",
      items: [
        "Categorize expenses for better tracking",
        "Create your first savings goal",
        "View monthly summaries and spending breakdowns",
        "Receive basic alerts (bill reminders, overspending warnings)",
      ],
    },
    {
      phase: "Phase 3",
      title: "Smarter Insights",
      items: [
        "Get personalized tips based on your habits",
        "Track progress toward financial goals",
        "Compare spending patterns month-to-month",
        "Receive nudges to improve savings",
      ],
    },
    {
      phase: "Phase 4",
      title: "Full Financial Health",
      items: [
        "Advanced reports and trend forecasting",
        "Gamified achievements for saving streaks",
        "Multi-device sync and secure cloud backup",
        "Enjoy a clear view of long-term financial health",
      ],
    },
  ];

  return (
    <section
      ref={roadmapRef}
      className="py-20 bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] dark:from-[var(--neutral-950)] dark:to-[var(--primary-900)] px-4"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-on-scroll opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Development{" "}
            <span className="text-[var(--primary-500)]">Roadmap</span>
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
            We're continuously improving BalanceIQ with new features and
            enhancements. Here's what we're working on.
          </p>
        </div>

        <div className="relative flex flex-col">
          {/* Vertical timeline line - centered on desktop, left on mobile */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-[var(--primary-500)] transform md:-translate-x-1/2"></div>

          {roadmapSteps.map((step, index) => (
            <RoadmapStep key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const RoadmapStep: React.FC<RoadmapStepProps> = ({ step, index }) => {
  return (
    <div
      className={`relative mb-12 animate-on-scroll opacity-0 ${
        index % 2 === 0
          ? "md:ml-0 md:mr-1/2 md:pr-8 md:pl-0 m self-start"
          : "md:ml-1/2 md:pl-8  self-end"
      } pl-10 md:w-1/2`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="absolute left-0 md:left-1/2 top-6 w-4 h-4 rounded-full bg-[var(--primary-500)] border-4 border-white dark:border-[var(--neutral-900)] transform -translate-x-2 -translate-y-2"></div>

      <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow-lg border border-[var(--border-light)]">
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 bg-[var(--primary-100)] text-[var(--primary-700)] rounded-full text-sm font-medium">
            {step.phase}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          {step.title}
        </h3>

        <ul className="space-y-2">
          {step.items.map((item, i) => (
            <li key={i} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-[var(--success-500)] mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-[var(--text-secondary)]">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Roadmap;