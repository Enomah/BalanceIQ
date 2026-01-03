import { Transaction, MonthYearGroup } from "@/types/dashboardTypes";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const groupTransactionsByMonth = (
  transactions: Transaction[]
): MonthYearGroup[] => {
  const groupMap = new Map<string, MonthYearGroup>();

  transactions.forEach((transaction) => {
    if (!transaction) return;
    const date = new Date(transaction.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${month}`;

    if (!groupMap.has(key)) {
      groupMap.set(key, {
        year,
        month,
        monthName: monthNames[month],
        transactions: [],
      });
    }
    groupMap.get(key)!.transactions.push(transaction);
  });

  return Array.from(groupMap.values())
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    })
    .map((group) => ({
      ...group,
      transactions: group.transactions.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    }));
};
