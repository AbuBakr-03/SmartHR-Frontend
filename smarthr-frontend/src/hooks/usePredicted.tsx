import {
  listPredictionsPrivate,
  retrievePredictionPrivate,
  deletePredictionPrivate,
  submitEvaluation,
  type predicted_type,
  type evaluation_type,
  type evaluation_response_type,
} from "@/apis/predictedapis";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ========================================
// PRIVATE HOOKS (Authentication required)
// ========================================

export const useListPredictionsPrivate = () => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<predicted_type[], Error>({
    queryKey: ["predicted-candidates-private"],
    queryFn: () => listPredictionsPrivate(axiosPrivate),
    enabled: !!axiosPrivate,
    retry: false, // Don't retry auth failures
  });
};

export const useRetrievePredictionPrivate = (id: number) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<predicted_type, Error>({
    queryKey: ["predicted-candidate-private", id],
    queryFn: () => retrievePredictionPrivate(axiosPrivate, id),
    enabled: !!id && !!axiosPrivate,
    retry: false, // Don't retry auth failures
  });
};

export const useDeletePredictionPrivate = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => deletePredictionPrivate(axiosPrivate, id),
    onSuccess: (_, deletedId) => {
      // Invalidate list queries
      queryClient.invalidateQueries({
        queryKey: ["predicted-candidates-private"],
      });

      // Remove specific item from cache
      queryClient.removeQueries({
        queryKey: ["predicted-candidate-private", deletedId],
      });

      // Invalidate related data that might be affected
      queryClient.invalidateQueries({ queryKey: ["interviews-private"] });
    },
    onError: (error) => {
      console.error("Delete predicted candidate failed:", error);
    },
  });
};

// ========================================
// SPECIAL PREDICTED CANDIDATE OPERATIONS
// ========================================

export const useSubmitEvaluation = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<
    evaluation_response_type,
    Error,
    { id: number; evaluationData: evaluation_type }
  >({
    mutationFn: ({ id, evaluationData }) =>
      submitEvaluation(axiosPrivate, id, evaluationData),
    onSuccess: (_, { id }) => {
      // Invalidate the specific predicted candidate to refresh with new evaluation
      queryClient.invalidateQueries({
        queryKey: ["predicted-candidate-private", id],
      });

      // Invalidate predicted candidates list
      queryClient.invalidateQueries({
        queryKey: ["predicted-candidates-private"],
      });

      // Invalidate interviews as evaluation might affect interview results
      queryClient.invalidateQueries({ queryKey: ["interviews-private"] });
    },
    onError: (error) => {
      console.error("Submit evaluation failed:", error);
    },
  });
};
