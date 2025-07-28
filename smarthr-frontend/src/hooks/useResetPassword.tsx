import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetpassword } from "@/apis/resetpasswordapis";

export const useResetPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resetpassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Password"] });
    },
  });
};
