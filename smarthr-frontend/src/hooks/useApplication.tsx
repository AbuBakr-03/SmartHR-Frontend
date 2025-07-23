import {
  createApplicationPrivate,
  deleteApplicationPrivate,
  listApplicationsPrivate,
  updateApplicationPrivate,
  type application_type,
  type application_post_type,
  retrieveApplicationPrivate,
  // Remove unused legacy functions
} from "@/apis/applicationapis";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ========================================
// PRIVATE HOOKS (Authentication required)
// ========================================

export const useListApplicationsPrivate = () => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<application_type[], Error>({
    queryKey: ["applications-private"],
    queryFn: () => listApplicationsPrivate(axiosPrivate),
    enabled: !!axiosPrivate,
    retry: false, // Don't retry auth failures
  });
};

export const useRetrieveApplicationPrivate = (id: number) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<application_type, Error>({
    queryKey: ["application-private", id],
    queryFn: () => retrieveApplicationPrivate(axiosPrivate, id),
    enabled: !!id && !!axiosPrivate,
    retry: false, // Don't retry auth failures
  });
};

export const useCreateApplicationPrivate = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<application_type, Error, application_post_type>({
    mutationFn: (applicationData) =>
      createApplicationPrivate(axiosPrivate, applicationData),
    onSuccess: () => {
      // Invalidate both private and public caches
      queryClient.invalidateQueries({ queryKey: ["applications-private"] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (error) => {
      console.error("Create application failed:", error);
    },
  });
};

export const useUpdateApplicationPrivate = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<application_type, Error, application_type>({
    mutationFn: (applicationData) =>
      updateApplicationPrivate(axiosPrivate, applicationData),
    onSuccess: (data) => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ["applications-private"] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });

      // Update specific item in cache
      queryClient.setQueryData(["application-private", data.id], data);
      queryClient.setQueryData(["application", data.id], data);
    },
    onError: (error) => {
      console.error("Update application failed:", error);
    },
  });
};

export const useDeleteApplicationPrivate = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => deleteApplicationPrivate(axiosPrivate, id),
    onSuccess: (_, deletedId) => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ["applications-private"] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });

      // Remove specific item from cache
      queryClient.removeQueries({
        queryKey: ["application-private", deletedId],
      });
      queryClient.removeQueries({ queryKey: ["application", deletedId] });
    },
    onError: (error) => {
      console.error("Delete application failed:", error);
    },
  });
};
