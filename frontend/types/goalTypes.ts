import { OptionType } from "@/components/dashboard/FormSelect";
import { LucideIcon } from "lucide-react";

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface FormField {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "textarea" | "select";
  icon: LucideIcon;
  placeholder?: string;
  value: string;
  error?: string;
  required?: boolean;
  min?: number | string;
  max?: number | string;
  step?: string;
  currencySymbol?: string;
  rows?: number;
  maxLength?: number;
  options?: OptionType[];
  disabled?: boolean;
}