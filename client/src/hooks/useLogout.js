import { useMutation } from "@tanstack/react-query";

import { api } from "@/api";

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await api.delete(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );
      return res.data;
    },
  });
};
