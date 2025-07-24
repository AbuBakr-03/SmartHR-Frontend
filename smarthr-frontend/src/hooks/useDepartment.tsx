import {
  createDepartmentPrivate,
  deleteDepartmentPrivate,
  listDepartments,
  listDepartmentsPrivate,
  retrieveDepartment,
  retrieveDepartmentPrivate,
  updateDepartmentPrivate,
  type department_type,
  type department_post_type,
} from "@/apis/departmentapis";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ========================================
// PUBLIC HOOKS (No authentication required)
// ========================================

export const useListDepartments = () => {
  return useQuery<department_type[], Error>({
    queryKey: ["departments"],
    queryFn: listDepartments,
    retry: 1,
  });
};

export const useRetrieveDepartment = (id: number) => {
  return useQuery<department_type, Error>({
    queryKey: ["department", id],
    queryFn: () => retrieveDepartment(id),
    enabled: !!id,
    retry: 1,
  });
};

// ========================================
// PRIVATE HOOKS (Require recruiter authentication)
// ========================================

export const useListDepartmentsPrivate = () => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<department_type[], Error>({
    queryKey: ["departments-private"],
    queryFn: () => listDepartmentsPrivate(axiosPrivate),
    enabled: !!axiosPrivate,
    retry: false, // Don't retry auth failures
  });
};

export const useRetrieveDepartmentPrivate = (id: number) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<department_type, Error>({
    queryKey: ["department-private", id],
    queryFn: () => retrieveDepartmentPrivate(axiosPrivate, id),
    enabled: !!id && !!axiosPrivate,
    retry: false,
  });
};

export const useCreateDepartmentPrivate = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<department_type, Error, department_post_type>({
    mutationFn: (departmentData) =>
      createDepartmentPrivate(axiosPrivate, departmentData),
    onSuccess: (newDepartment) => {
      // Invalidate all department lists to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["departments-private"] });

      // Optimistically add the new department to cache
      queryClient.setQueryData(["department", newDepartment.id], newDepartment);
      queryClient.setQueryData(
        ["department-private", newDepartment.id],
        newDepartment,
      );
    },
    onError: (error) => {
      console.error("Create department failed:", error);
    },
  });
};

export const useUpdateDepartmentPrivate = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<department_type, Error, department_type>({
    mutationFn: (departmentData) =>
      updateDepartmentPrivate(axiosPrivate, departmentData),
    onSuccess: (updatedDepartment) => {
      // Invalidate all department lists
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["departments-private"] });

      // Update specific item in cache
      queryClient.setQueryData(
        ["department", updatedDepartment.id],
        updatedDepartment,
      );
      queryClient.setQueryData(
        ["department-private", updatedDepartment.id],
        updatedDepartment,
      );
    },
    onError: (error) => {
      console.error("Update department failed:", error);
    },
  });
};

export const useDeleteDepartmentPrivate = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => deleteDepartmentPrivate(axiosPrivate, id),
    onSuccess: (_, deletedId) => {
      // Invalidate all department lists
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["departments-private"] });

      // Remove specific item from cache
      queryClient.removeQueries({ queryKey: ["department", deletedId] });
      queryClient.removeQueries({
        queryKey: ["department-private", deletedId],
      });

      // Also invalidate related jobs since they depend on departments
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs-private"] });
    },
    onError: (error) => {
      console.error("Delete department failed:", error);
    },
  });
};
