"use client";

import { useAuthStore } from "@/store/authStore";
import { useAppMutation } from "@/hooks/useAppMutation";
import apiClient from "@/lib/api/client";
import { useState } from "react";
import FormInput from "../dashboard/FormInput";
import { Shield, Trash2, Loader2, Lock } from "lucide-react";
import Modal from "../ui/Modal";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/store/toastStore";

export default function SecurityTab() {
  const { logout } = useAuthStore();
  const { showToast } = useToastStore();
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const passwordMutation = useAppMutation({
    mutationFn: (data: unknown) => apiClient.put("/user/change-password", data),
    successMessage: "Password updated successfully",
    onSuccess: () => {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
  });

  const deleteMutation = useAppMutation({
    mutationFn: () => apiClient.delete("/user/account"),
    successMessage: "Account deleted successfully",
    onSuccess: () => {
      logout();
      router.push("/auth/sign-in");
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }
    passwordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  return (
    <div className="space-y-6">
      {/* Password Change Section */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[var(--primary-100)] text-[var(--primary-600)] rounded-lg">
            <Shield size={20} />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Security & Password
          </h2>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <FormInput
            id="currentPassword"
            label="Current Password"
            type="password"
            icon={Lock}
            value={passwordData.currentPassword}
            onChange={(val) =>
              setPasswordData({
                ...passwordData,
                currentPassword: val,
              })
            }
            required
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <FormInput
              id="newPassword"
              label="New Password"
              type="password"
              icon={Lock}
              value={passwordData.newPassword}
              onChange={(val) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: val,
                })
              }
              required
            />
            <FormInput
              id="confirmPassword"
              label="Confirm New Password"
              type="password"
              icon={Lock}
              value={passwordData.confirmPassword}
              onChange={(val) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: val,
                })
              }
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={passwordMutation.isPending}
              className="w-full sm:w-auto px-6 py-2.5 bg-[var(--primary-500)] text-white rounded-xl font-medium hover:bg-[var(--primary-600)] transition-all focus:ring-4 focus:ring-[var(--primary-500)]/20 disabled:opacity-50"
            >
              {passwordMutation.isPending ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone Section */}
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 text-red-600 rounded-lg">
            <Trash2 size={20} />
          </div>
          <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
        </div>

        <p className="text-[var(--text-secondary)] mb-6 max-w-lg">
          Deleting your account is permanent and cannot be undone. All your
          transactions, budgets, and goals will be permanently erased.
        </p>

        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all focus:ring-4 focus:ring-red-500/20"
        >
          Delete Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Account"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-[var(--text-secondary)]">
            Are you absolutely sure? This action is permanent and will delete
            all your financial data forever.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 py-2 px-4 border border-[var(--border-light)] rounded-lg font-medium hover:bg-[var(--bg-tertiary)]"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center"
            >
              {deleteMutation.isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Delete Forever"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
