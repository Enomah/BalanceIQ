import { useEffect, useRef, useCallback } from "react";

interface UseTransactionsListLogicProps {
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onLoadMore: () => void;
}

export const useTransactionsListLogic = ({
  loading,
  currentPage,
  totalPages,
  onLoadMore,
}: UseTransactionsListLogicProps) => {
  const observerTarget = useRef<HTMLDivElement>(null);
  const hasMore = currentPage < totalPages;

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    },
    [hasMore, loading, onLoadMore]
  );

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

  return {
    observerTarget,
    hasMore,
  };
};
