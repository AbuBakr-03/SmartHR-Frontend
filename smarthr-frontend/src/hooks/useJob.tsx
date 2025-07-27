import {
  createJobPrivate,
  deleteJobPrivate,
  listJobs,
  listJobsPrivate,
  retrieveJob,
  retrieveJobPrivate,
  updateJobPrivate,
  type job_type,
  type job_post_type,
} from "@/apis/jobapis";
import { useFilter } from "@/contexts/FilterProvider";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ========================================
// PUBLIC HOOKS (No authentication required)
// ========================================

export const useListJobs = () => {
  const filterdata = useFilter();
  const { company, department } = filterdata;
  return useQuery<job_type[], Error>({
    queryKey: ["jobs"],
    queryFn: () => listJobs({ company, department }),
    retry: 1,
  });
};

export const useRetrieveJob = (id: number) => {
  return useQuery<job_type, Error>({
    queryKey: ["job", id],
    queryFn: () => retrieveJob(id),
    enabled: !!id,
    retry: 1,
  });
};

// ========================================
// PRIVATE HOOKS (Require recruiter authentication)
// ========================================

export const useListJobsPrivate = () => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<job_type[], Error>({
    queryKey: ["jobs-private"],
    queryFn: () => listJobsPrivate(axiosPrivate),
    enabled: !!axiosPrivate,
    retry: false, // Don't retry auth failures
  });
};

export const useRetrieveJobPrivate = (id: number) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<job_type, Error>({
    queryKey: ["job-private", id],
    queryFn: () => retrieveJobPrivate(axiosPrivate, id),
    enabled: !!id && !!axiosPrivate,
    retry: false,
  });
};

export const useCreateJobPrivate = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<job_type, Error, job_post_type>({
    mutationFn: (jobData) => createJobPrivate(axiosPrivate, jobData),
    onSuccess: (newJob) => {
      // Invalidate all job lists to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs-private"] });

      // Optimistically add the new job to cache
      queryClient.setQueryData(["job", newJob.id], newJob);
      queryClient.setQueryData(["job-private", newJob.id], newJob);
    },
    onError: (error) => {
      console.error("Create job failed:", error);
    },
  });
};

export const useUpdateJobPrivate = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<job_type, Error, job_type>({
    mutationFn: (jobData) => updateJobPrivate(axiosPrivate, jobData),
    onSuccess: (updatedJob) => {
      // Invalidate all job lists
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs-private"] });

      // Update specific item in cache
      queryClient.setQueryData(["job", updatedJob.id], updatedJob);
      queryClient.setQueryData(["job-private", updatedJob.id], updatedJob);
    },
    onError: (error) => {
      console.error("Update job failed:", error);
    },
  });
};

export const useDeleteJobPrivate = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => deleteJobPrivate(axiosPrivate, id),
    onSuccess: (_, deletedId) => {
      // Invalidate all job lists
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs-private"] });

      // Remove specific item from cache
      queryClient.removeQueries({ queryKey: ["job", deletedId] });
      queryClient.removeQueries({ queryKey: ["job-private", deletedId] });

      // Also invalidate related applications since they depend on jobs
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["applications-private"] });
    },
    onError: (error) => {
      console.error("Delete job failed:", error);
    },
  });
};
