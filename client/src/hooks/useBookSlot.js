import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/api";

export const useBookSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/book", data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([
        "slots",
        variables.userId,
        variables.date,
      ]);
    },
  });
};
