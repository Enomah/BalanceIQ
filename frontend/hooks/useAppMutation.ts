import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useToastStore } from "@/store/toastStore";

interface AppMutationOptions<TData, TError, TVariables, TContext>
  extends UseMutationOptions<TData, TError, TVariables, TContext> {
  successMessage?: string;
  errorMessage?: string;
}

export function useAppMutation<
  TData = any,
  TError = any,
  TVariables = void,
  TContext = any
>(options: AppMutationOptions<TData, TError, TVariables, TContext>) {
  const { showToast } = useToastStore.getState();

  return useMutation({
    ...options,
    onSuccess: (...args) => {
      if (options.successMessage) {
        showToast(options.successMessage, "success");
      }
      if (options.onSuccess) {
        (options.onSuccess as any)(...args);
      }
    },
    onError: (...args) => {
      if (options.errorMessage) {
        showToast(options.errorMessage, "error");
      }
      if (options.onError) {
        (options.onError as any)(...args);
      }
    },
  });
}
