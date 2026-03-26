import { useMutation } from "@tanstack/react-query";

import { api } from "@/api";

export const useCreateAvailability = () => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/availability", data, {
        withCredentials: true,
      });
      return res.data;
    },
  });
};
