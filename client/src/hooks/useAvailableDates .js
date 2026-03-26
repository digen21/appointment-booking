import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useAvailableDates = (userId, token) => {
  return useQuery({
    queryKey: ["available-dates", userId, token],
    enabled: !!userId,
    retry: false,
    queryFn: async () => {
      const res = await api.get(
        `/availability/dates/${userId}?token=${token || ""}`,
      );
      return res.data;
    },
    staleTime: 1000 * 60,
  });
};
