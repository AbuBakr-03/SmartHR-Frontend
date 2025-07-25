import { login, type request, type response } from "@/apis/loginapis";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLoginAccount = () => {
  const queryClient = useQueryClient();
  return useMutation<response, Error, request>({
    mutationFn: (details) => login(details),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["login"] }),
  });
};
