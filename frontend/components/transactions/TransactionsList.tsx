import TransactionItem from "@/components/transactions/TransactionItem";
import { MonthYearGroup } from "@/types/dashboardTypes";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useCallback } from "react";

interface TransactionsListProps {
  groupedTransactions: MonthYearGroup[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onLoadMore: () => void;
}

export default function TransactionsList({
  groupedTransactions,
  loading,
  currentPage,
  totalPages,
  onLoadMore,
}: TransactionsListProps) {
  const observerTarget = useRef<HTMLDivElement>(null);
  const hasMore = currentPage < totalPages;

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !loading) {
      onLoadMore();
    }
  }, [hasMore, loading, onLoadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px", 
      threshold: 0.1,
    });

    const currentTarget = observerTarget.current;
    if (currentTarget && hasMore) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [handleObserver, hasMore]);

  // console.log("Rendering TransactionsList with groups:", groupedTransactions);

  return (
    <>
      <div className="space-y-8">
        {groupedTransactions.map((group, groupIndex) => (
          <div
            key={`${group.year}-${group.month}`}
            className="group"
            style={{
              animationDelay: `${groupIndex * 100}ms`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-[5px]">
                <div className="w-1 h-8 bg-[var(--primary-500)] rounded-full"></div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  {group.monthName} {group.year}
                </h2>
              </div>
              <Link href={`/dashboard/summary?month=${group.month+1}&year=${group.year}`} className="ml-4 px-3 py-1 bg-[var(--bg-tertiary)] rounded-full">
                <div className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-1">
                  View summary <ArrowRight size={18}/>
                </div>
              </Link>
            </div>

            <div className="space-y-3">
              {group.transactions.map((transaction, idx) => (
                <div
                  key={`${transaction.id || idx}-${transaction.createdAt}`}
                  className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  style={{
                    animationDelay: `${idx * 50}ms`,
                  }}
                >
                  <TransactionItem transaction={transaction} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="mt-[10px] space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-light)] animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[var(--bg-tertiary)] rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-[var(--bg-tertiary)] rounded"></div>
                    <div className="h-3 w-24 bg-[var(--bg-tertiary)] rounded"></div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="h-4 w-20 bg-[var(--bg-tertiary)] rounded"></div>
                  <div className="h-3 w-16 bg-[var(--bg-tertiary)] rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div
          ref={observerTarget}
          className="h-4 mt-8 flex items-center justify-center"
        >
          {loading && (
            <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
              {/* <div className="w-4 h-4 border-2 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin"></div> */}
              {/* <span className="text-sm">Loading more transactions...</span> */}
            </div>
          )}
        </div>
      )}
    </>
  );
}