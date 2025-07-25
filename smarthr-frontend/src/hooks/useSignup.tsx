import {
  signup,
  type request_schema,
  type response_schema,
} from "@/apis/signupapis";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation<response_schema, Error, request_schema>({
    mutationFn: (details) => signup(details),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["signup"] }),
  });
};
