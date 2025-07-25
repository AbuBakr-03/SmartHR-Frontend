import { useMutation, useQueryClient } from "@tanstack/react-query";
import { forgotpassword } from "@/apis/forgotpasswordapis";

export const useForgotPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: forgotpassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Email"] });
    },
  });
};
