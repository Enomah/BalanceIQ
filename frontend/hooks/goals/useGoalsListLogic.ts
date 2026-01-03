import { useEffect, useRef, useCallback } from "react";

interface UseGoalsListLogicProps {
  loadingMore: boolean;
  hasMore: boolean;
  handleLoadMore: () => void;
}

export const useGoalsListLogic = ({
  loadingMore,
  hasMore,
  handleLoadMore,
}: UseGoalsListLogicProps) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loadingMore) {
        handleLoadMore();
      }
    },
    [hasMore, loadingMore, handleLoadMore]
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

  return { observerTarget };
};
