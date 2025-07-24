import {
  createInterviewPrivate,
  deleteInterviewPrivate,
  listInterviewsPrivate,
  updateInterviewPrivate,
  retrieveInterviewPrivate,
  analyzeInterviewRecordingPrivate,
  generateInterviewQuestions,
  type interview_type,
  type interview_post_type,
  type interview_put_type,
  type interview_recording_type,
  type generate_interview_type,
} from "@/apis/interviewapis";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ========================================
// PRIVATE HOOKS (Authentication required)
// ========================================

export const useListInterviewsPrivate = () => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<interview_type[], Error>({
    queryKey: ["interviews-private"],
    queryFn: () => listInterviewsPrivate(axiosPrivate),
    enabled: !!axiosPrivate,
    retry: false, // Don't retry auth failures
  });
};

export const useRetrieveInterviewPrivate = (id: number) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<interview_type, Error>({
    queryKey: ["interview-private", id],
    queryFn: () => retrieveInterviewPrivate(axiosPrivate, id),
    enabled: !!id && !!axiosPrivate,
    retry: false, // Don't retry auth failures
  });
};

export const useCreateInterviewPrivate = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<interview_type, Error, interview_post_type>({
    mutationFn: (interviewData) =>
      createInterviewPrivate(axiosPrivate, interviewData),
    onSuccess: (newInterview) => {
      // Invalidate interviews list
      queryClient.invalidateQueries({ queryKey: ["interviews-private"] });

      // Add new interview to cache
      queryClient.setQueryData(
        ["interview-private", newInterview.id],
        newInterview,
      );

      // Also invalidate applications since interview creation might affect application status
      queryClient.invalidateQueries({ queryKey: ["applications-private"] });
    },
    onError: (error) => {
      console.error("Create interview failed:", error);
    },
  });
};

export const useUpdateInterviewPrivate = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<interview_type, Error, interview_put_type>({
    mutationFn: (interviewData) =>
      updateInterviewPrivate(axiosPrivate, interviewData),
    onSuccess: (updatedInterview) => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ["interviews-private"] });

      // Update specific item in cache
      queryClient.setQueryData(
        ["interview-private", updatedInterview.id],
        updatedInterview,
      );

      // Invalidate related data that might be affected
      queryClient.invalidateQueries({ queryKey: ["applications-private"] });
      queryClient.invalidateQueries({
        queryKey: ["predicted-candidates-private"],
      });
    },
    onError: (error) => {
      console.error("Update interview failed:", error);
    },
  });
};

export const useDeleteInterviewPrivate = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => deleteInterviewPrivate(axiosPrivate, id),
    onSuccess: (_, deletedId) => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ["interviews-private"] });

      // Remove specific item from cache
      queryClient.removeQueries({
        queryKey: ["interview-private", deletedId],
      });

      // Invalidate related data
      queryClient.invalidateQueries({ queryKey: ["applications-private"] });
      queryClient.invalidateQueries({
        queryKey: ["predicted-candidates-private"],
      });
    },
    onError: (error) => {
      console.error("Delete interview failed:", error);
    },
  });
};

// ========================================
// SPECIAL INTERVIEW OPERATIONS
// ========================================

export const useAnalyzeInterviewRecording = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<interview_recording_type, Error, number>({
    mutationFn: (interviewId) =>
      analyzeInterviewRecordingPrivate(axiosPrivate, interviewId),
    onSuccess: (_, interviewId) => {
      // Invalidate the specific interview to refresh with new analysis data
      queryClient.invalidateQueries({
        queryKey: ["interview-private", interviewId],
      });

      // Invalidate interviews list
      queryClient.invalidateQueries({ queryKey: ["interviews-private"] });

      // Invalidate predicted candidates as analysis might create new candidates
      queryClient.invalidateQueries({
        queryKey: ["predicted-candidates-private"],
      });
    },
    onError: (error) => {
      console.error("Interview analysis failed:", error);
    },
  });
};

export const useGenerateInterviewQuestions = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<generate_interview_type, Error, number>({
    mutationFn: (interviewId) =>
      generateInterviewQuestions(axiosPrivate, interviewId),
    onSuccess: (_, interviewId) => {
      // Invalidate the specific interview to refresh with new questions
      queryClient.invalidateQueries({
        queryKey: ["interview-private", interviewId],
      });

      // Invalidate interviews list
      queryClient.invalidateQueries({ queryKey: ["interviews-private"] });
    },
    onError: (error) => {
      console.error("Question generation failed:", error);
    },
  });
};
