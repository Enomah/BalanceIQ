"use client";

import { useAuthStore } from "@/store/authStore";
import { useAppMutation } from "@/hooks/useAppMutation";
import apiClient from "@/lib/api/client";
import { useState } from "react";
import FormInput from "../dashboard/FormInput";
import { User as UserIcon, Type, Mail } from "lucide-react";
import { useEffect } from "react";

export default function ProfileTab() {
  const { userProfile, patchUserProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: userProfile?.fullName || "",
    nickname: userProfile?.nickname || "",
    email: userProfile?.email || "",
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.fullName,
        nickname: userProfile.nickname,
        email: userProfile.email,
      });
    }
  }, [userProfile]);

  const mutation = useAppMutation({
    mutationFn: (data: unknown) => apiClient.put("/user/profile", data),
    successMessage: "Profile updated successfully",
    onSuccess: (response) => {
      patchUserProfile(response.data.user);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[var(--primary-100)] text-[var(--primary-600)] rounded-lg">
          <UserIcon size={20} />
        </div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          Profile Information
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          id="fullName"
          label="Full Name"
          type="text"
          icon={UserIcon}
          value={formData.fullName}
          onChange={(val) => setFormData({ ...formData, fullName: val })}
          required
        />
        <FormInput
          id="nickname"
          label="Nickname"
          type="text"
          icon={Type}
          value={formData.nickname}
          onChange={(val) => setFormData({ ...formData, nickname: val })}
          required
        />
        <FormInput
          id="email"
          label="Email Address"
          type="email"
          icon={Mail}
          value={formData.email}
          onChange={() => {}}
          disabled
        />

        <div className="pt-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full sm:w-auto px-6 py-2.5 bg-[var(--primary-500)] text-white rounded-xl font-medium hover:bg-[var(--primary-600)] transition-all focus:ring-4 focus:ring-[var(--primary-500)]/20 disabled:opacity-50"
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
