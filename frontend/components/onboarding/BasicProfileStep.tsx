"use client";

import { motion } from "framer-motion";
import { User, Camera } from "lucide-react";
import React from "react";

interface BasicProfileStepProps {
  formData: { avatar: File | null };
  onChange: (field: string, value: any) => void;
}

export default function BasicProfileStep({
  formData,
  onChange,
}: BasicProfileStepProps) {
  return (
    <div className="flex flex-col items-center justify-center mt-[20px]">
     <div className="relative">
       <div className="w-24 h-24 bg-gradient-to-br from-[var(--primary-100)] to-[var(--primary-200)] dark:from-[var(--neutral-800)] dark:to-[var(--neutral-700)] rounded-full flex items-center justify-center border-2 border border-[var(--primary-300)] dark:border-[var(--neutral-600)] mb-4 shadow-inner overflow-hidden">
        {formData.avatar ? (
          <img
            src={URL.createObjectURL(formData.avatar)}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <User className="h-12 w-12 text-[var(--primary-400)]" />
        )}
      </div>

      <label
        htmlFor="avatar"
        className="absolute bottom-2 right-2 bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] p-2 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Camera className="h-4 w-4 text-white" />
        <input
          id="avatar"
          type="file"
          className="hidden"
          onChange={(e) => onChange("avatar", e.target.files?.[0] || null)}
          accept="image/*"
        />
      </label>

     </div>
      <p className="text-sm text-[var(--text-secondary)] mt-2">
        Add a photo to personalize your experience
      </p>
    </div>
  );
}