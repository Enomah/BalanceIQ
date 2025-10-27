export const getProgress = (spent: number, allocated: number): number =>
  allocated > 0 ? (spent / allocated) * 100 : 0;

export const isOverspent = (spent: number, allocated: number): boolean =>
  spent > allocated;

export const getRemaining = (allocated: number, spent: number): number =>
  allocated - spent;

export const getStatus = (progress: number, isOverspent: boolean) => {
  if (isOverspent) return { label: "Over Budget", color: "error", icon: "AlertTriangle" };
  if (progress >= 80) return { label: "Almost There", color: "warning", icon: "AlertTriangle" };
  return { label: "On Track", color: "success", icon: "Check" };
};