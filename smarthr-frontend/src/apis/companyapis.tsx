/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { z } from "zod";

const BASE_URL = "http://127.0.0.1:8000/api/company/";

// Schema for company
export const company_schema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  logo: z.string(), // Image URL from Django
});

const company_array_schema = z.array(company_schema);

export type company_type = z.infer<typeof company_schema>;

// Post type for creating companies - logo should be File for upload
export type company_post_type = Omit<company_type, "id" | "logo"> & {
  logo: File; // For file upload
};

// ========================================
// PUBLIC FUNCTIONS (No authentication required)
// ========================================

export const listCompanies = async (): Promise<company_type[]> => {
  try {
    const { data } = await axios.get(BASE_URL);
    const result = company_array_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("List companies error:", error);
    throw error;
  }
};

export const retrieveCompany = async (id: number): Promise<company_type> => {
  try {
    const { data } = await axios.get(`${BASE_URL}${id}/`);
    const result = company_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("Retrieve company error:", error);
    throw error;
  }
};

// ========================================
// PRIVATE FUNCTIONS (Require recruiter authentication)
// ========================================

export const listCompaniesPrivate = async (
  axiosPrivate: any,
): Promise<company_type[]> => {
  try {
    const { data } = await axiosPrivate.get("company/");
    const result = company_array_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("List companies error:", error);
    throw error;
  }
};

export const createCompanyPrivate = async (
  axiosPrivate: any,
  companyData: company_post_type,
): Promise<company_type> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("name", companyData.name);
    formData.append("slug", companyData.slug);
    formData.append("logo", companyData.logo);

    const { data } = await axiosPrivate.post("company/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const result = company_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      console.error("Response data:", data);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("Create company error:", error);
    throw error;
  }
};

export const retrieveCompanyPrivate = async (
  axiosPrivate: any,
  id: number,
): Promise<company_type> => {
  try {
    const { data } = await axiosPrivate.get(`company/${id}/`);
    const result = company_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("Retrieve company error:", error);
    throw error;
  }
};

export const updateCompanyPrivate = async (
  axiosPrivate: any,
  companyData: company_type,
): Promise<company_type> => {
  try {
    // For updates, we don't change the logo unless specifically provided
    const { data } = await axiosPrivate.patch(`company/${companyData.id}/`, {
      name: companyData.name,
      slug: companyData.slug,
      // Note: logo updates would need separate handling with FormData if needed
    });

    const result = company_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("Update company error:", error);
    throw error;
  }
};

export const deleteCompanyPrivate = async (
  axiosPrivate: any,
  id: number,
): Promise<void> => {
  try {
    await axiosPrivate.delete(`company/${id}/`);
  } catch (error) {
    console.error("Delete company error:", error);
    throw error;
  }
};
