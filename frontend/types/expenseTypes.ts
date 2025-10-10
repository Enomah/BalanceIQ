import { OptionType } from "@/components/dashboard/FormSelect";
import { LucideIcon } from "lucide-react";

export interface FormDataTypes {
  amount: string;
  category: string;
  description: string;
}

export interface FormErrors {
  amount?: string;
  category?: string;
  description?: string;
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