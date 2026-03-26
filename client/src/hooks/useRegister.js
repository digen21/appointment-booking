import { useMutation } from "@tanstack/react-query";

import { api } from "@/api";

export const useRegister = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      const res = await api.post("/auth/register", credentials);
      return res.data;
    },
  });
};
