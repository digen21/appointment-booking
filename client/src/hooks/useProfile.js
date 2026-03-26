import { useQuery } from "@tanstack/react-query";

import { api } from "@/api";

export const useProfile = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await api.get("/auth/profile", {
        withCredentials: true,
      });
      return res.data;
    },
    retry: 2,
    staleTime: 1000 * 60,
  });
};
