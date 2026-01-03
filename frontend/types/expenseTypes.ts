import { OptionType } from "@/components/dashboard/FormSelect";
import { LucideIcon, Loader2, RefreshCcw, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface FormDataTypes {
  amount: string;
  category: string;
  description: string;
  isRecurring?: boolean;
  frequency?: "daily" | "weekly" | "monthly" | "yearly";
  startDate?: string;
}

export interface FormErrors {
  amount?: string;
  category?: string;
  description?: string;
  frequency?: string;
  startDate?: string;
  isRecurring?: string;
}

export interface FormField {
  id: keyof FormDataTypes;
  label: string;
  type: "number" | "select" | "textarea" | "date";
  icon: LucideIcon;
  placeholder?: string;
  required?: boolean;
  min?: number;
  step?: string;
  currencySymbol?: string;
  options?: OptionType[];
  rows?: number;
  value: string;
  error?: string;
}
