import {
  createCompanyPrivate,
  deleteCompanyPrivate,
  listCompanies,
  listCompaniesPrivate,
  retrieveCompany,
  retrieveCompanyPrivate,
  updateCompanyPrivate,
  type company_type,
  type company_post_type,
} from "@/apis/companyapis";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ========================================
// PUBLIC HOOKS (No authentication required)
// ========================================

export const useListCompanies = () => {
  return useQuery<company_type[], Error>({
    queryKey: ["companies"],
    queryFn: listCompanies,
    retry: 1,
  });
};

export const useRetrieveCompany = (id: number) => {
  return useQuery<company_type, Error>({
    queryKey: ["company", id],
    queryFn: () => retrieveCompany(id),
    enabled: !!id,
    retry: 1,
  });
};

// ========================================
// PRIVATE HOOKS (Require recruiter authentication)
// ========================================

export const useListCompaniesPrivate = () => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<company_type[], Error>({
    queryKey: ["companies-private"],
    queryFn: () => listCompaniesPrivate(axiosPrivate),
    enabled: !!axiosPrivate,
    retry: false, // Don't retry auth failures
  });
};

export const useRetrieveCompanyPrivate = (id: number) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<company_type, Error>({
    queryKey: ["company-private", id],
    queryFn: () => retrieveCompanyPrivate(axiosPrivate, id),
    enabled: !!id && !!axiosPrivate,
    retry: false,
  });
};

export const useCreateCompanyPrivate = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<company_type, Error, company_post_type>({
    mutationFn: (companyData) => createCompanyPrivate(axiosPrivate, companyData),
    onSuccess: (newCompany) => {
      // Invalidate all company lists to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["companies-private"] });

      // Optimistically add the new company to cache
      queryClient.setQueryData(["company", newCompany.id], newCompany);
      queryClient.setQueryData(["company-private", newCompany.id], newCompany);
    },
    onError: (error) => {
      console.error("Create company failed:", error);
    },
  });
};

export const useUpdateCompanyPrivate = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<company_type, Error, company_type>({
    mutationFn: (companyData) => updateCompanyPrivate(axiosPrivate, companyData),
    onSuccess: (updatedCompany) => {
      // Invalidate all company lists
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["companies-private"] });

      // Update specific item in cache
      queryClient.setQueryData(["company", updatedCompany.id], updatedCompany);
      queryClient.setQueryData(
        ["company-private", updatedCompany.id],
        updatedCompany,
      );
    },
    onError: (error) => {
      console.error("Update company failed:", error);
    },
  });
};

export const useDeleteCompanyPrivate = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => deleteCompanyPrivate(axiosPrivate, id),
    onSuccess: (_, deletedId) => {
      // Invalidate all company lists
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["companies-private"] });

      // Remove specific item from cache
      queryClient.removeQueries({ queryKey: ["company", deletedId] });
      queryClient.removeQueries({ queryKey: ["company-private", deletedId] });

      // Also invalidate related jobs since they depend on companies
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs-private"] });
    },
    onError: (error) => {
      console.error("Delete company failed:", error);
    },
  });
};
