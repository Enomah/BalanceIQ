"use client";

export const formatCurrency = (amount: number, currency: string): string => {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency || "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  } catch {
    console.warn("Currency formatting error");
    // Safe fallback if currency code is still invalid
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  }
};
