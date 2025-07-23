import {
  createApplicationPrivate,
  deleteApplicationPrivate,
  listApplications,
  listApplicationsPrivate,
  retrieveApplication,
  updateApplicationPrivate,
  type application_type,
  type application_post_type,
  retrieveApplicationPrivate,
} from "@/apis/applicationapis";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Public hook (no auth required)
export const useListApplications = () => {
  return useQuery<application_type[], Error>({
    queryKey: ["applications"],
    queryFn: listApplications,
  });
};

// Private hooks (require auth)
export const useListApplicationsPrivate = () => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<application_type[], Error>({
    queryKey: ["applications-private"],
    queryFn: () => listApplicationsPrivate(axiosPrivate),
    enabled: !!axiosPrivate,
    retry: false, // 🔑 ADD THIS LINE
  });
};

export const useCreateApplicationPrivate = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<application_type, Error, application_post_type>({
    mutationFn: (applicationData) =>
      createApplicationPrivate(axiosPrivate, applicationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications-private"] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

export const useRetrieveApplicationPrivate = (id: number) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<application_type, Error>({
    queryKey: ["application-private", id],
    queryFn: () => retrieveApplicationPrivate(axiosPrivate, id),
    enabled: !!id && !!axiosPrivate,
    retry: false, // 🔑 ADD THIS LINE
  });
};

export const useUpdateApplicationPrivate = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<application_type, Error, application_type>({
    mutationFn: (applicationData) =>
      updateApplicationPrivate(axiosPrivate, applicationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications-private"] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

export const useDeleteApplicationPrivate = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => deleteApplicationPrivate(axiosPrivate, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications-private"] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

// Legacy hooks for backward compatibility (using private axios for dashboard)
export const useCreateApplication = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<application_type, Error, application_post_type>({
    mutationFn: (applicationData) =>
      createApplicationPrivate(axiosPrivate, applicationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["applications-private"] });
    },
  });
};

export const useRetrieveApplication = (id: number) => {
  return useQuery<application_type, Error>({
    queryKey: ["application", id],
    queryFn: () => retrieveApplication(id),
    enabled: !!id,
  });
};

export const useUpdateApplication = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<application_type, Error, application_type>({
    mutationFn: (applicationData) =>
      updateApplicationPrivate(axiosPrivate, applicationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["applications-private"] });
    },
  });
};

export const useDeleteApplication = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => deleteApplicationPrivate(axiosPrivate, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["applications-private"] });
    },
  });
};
