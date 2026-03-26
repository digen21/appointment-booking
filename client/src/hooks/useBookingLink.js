import { useQuery } from "@tanstack/react-query";

import { api } from "@/api";

export const useBookingLink = () => {
  return useQuery({
    queryKey: ["booking-link"],
    queryFn: async () => {
      const res = await api.get("/availability/booking-link", {
        withCredentials: true,
      });
      return res.data;
    },
    staleTime: 1000 * 60,
  });
};
