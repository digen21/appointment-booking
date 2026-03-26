import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useSlots = (userId, date, token) => {
  return useQuery({
    queryKey: ["slots", userId, date, token],
    enabled: !!date,
    retry: false,
    queryFn: async () => {
      const res = await api.get(
        `/availability/slots/${userId}?date=${date}&token=${token || ""}`,
      );
      return res.data;
    },
    staleTime: 1000 * 60,
  });
};
