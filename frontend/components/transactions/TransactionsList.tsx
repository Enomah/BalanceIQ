import { MonthYearGroup } from "@/types/dashboardTypes";
import { useTransactionsListLogic } from "@/hooks/transactions/useTransactionsListLogic";
import TransactionsGroup from "./TransactionsGroup";
import TransactionsLoading from "./TransactionsLoading";

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
  const { observerTarget, hasMore } = useTransactionsListLogic({
    loading,
    currentPage,
    totalPages,
    onLoadMore,
  });

  return (
    <>
      <div className="space-y-8">
        {groupedTransactions.map((group, groupIndex) => (
          <TransactionsGroup
            key={`${group.year}-${group.month}`}
            group={group}
            groupIndex={groupIndex}
          />
        ))}
      </div>

      {loading && <TransactionsLoading />}

      {hasMore && (
        <div
          ref={observerTarget}
          className="h-4 mt-8 flex items-center justify-center"
        >
          {loading && (
            <div className="flex items-center space-x-2 text-[var(--text-secondary)]"></div>
          )}
        </div>
      )}
    </>
  );
}
