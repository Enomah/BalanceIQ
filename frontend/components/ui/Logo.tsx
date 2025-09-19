import { Scale } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link href={"/"} className="flex items-center">
      <div className="text-[var(--primary-500)] rounded-lg flex items-center justify-center">
        <Scale className="h-6 w-6 text-[var(--primary-500)]" />
      </div>
      <span className="text-2xl font-bold text-[var(--primary-500)] italic">
        B.IQ
      </span>
    </Link>
  );
}
