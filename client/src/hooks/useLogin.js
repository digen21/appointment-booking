import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/api";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const res = await api.post("/auth/login", credentials);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate auth query to refetch user data
      queryClient.invalidateQueries(["auth"]);
    },
  });
};
