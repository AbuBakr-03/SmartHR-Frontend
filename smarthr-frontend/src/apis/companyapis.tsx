/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { z } from "zod";

const BASE_URL = "http://127.0.0.1:8000/api/company/";

// Schema for company
const company_schema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  logo: z.string(),
});

const company_array_schema = z.array(company_schema);

export type company_type = z.infer<typeof company_schema>;

// Post type for creating jobs
export type company_post_type = Omit<company_type, "id">;

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
    // Fixed: Use correct job endpoint, not application endpoint
    const { data } = await axiosPrivate.post("company/", companyData);

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
    // Fixed: Use correct job endpoint and fields
    const { data } = await axiosPrivate.patch(`company/${companyData.id}/`, {
      name: companyData.name,
      slug: companyData.slug,
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
