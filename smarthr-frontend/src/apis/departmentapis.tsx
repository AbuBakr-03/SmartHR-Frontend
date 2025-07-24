/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { z } from "zod";

const BASE_URL = "http://127.0.0.1:8000/api/department/";

// Schema for department
const department_schema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
});

const department_array_schema = z.array(department_schema);

export type department_type = z.infer<typeof department_schema>;

// Post type for creating jobs
export type department_post_type = Omit<department_type, "id">;

// ========================================
// PUBLIC FUNCTIONS (No authentication required)
// ========================================

export const listDepartments = async (): Promise<department_type[]> => {
  try {
    const { data } = await axios.get(BASE_URL);
    const result = department_array_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("List departments error:", error);
    throw error;
  }
};

export const retrieveDepartment = async (
  id: number,
): Promise<department_type> => {
  try {
    const { data } = await axios.get(`${BASE_URL}${id}/`);
    const result = department_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("Retrieve department error:", error);
    throw error;
  }
};

// ========================================
// PRIVATE FUNCTIONS (Require recruiter authentication)
// ========================================

export const listDepartmentsPrivate = async (
  axiosPrivate: any,
): Promise<department_type[]> => {
  try {
    const { data } = await axiosPrivate.get("department/");
    const result = department_array_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("List departments error:", error);
    throw error;
  }
};

export const createDepartmentPrivate = async (
  axiosPrivate: any,
  departmentData: department_post_type,
): Promise<department_type> => {
  try {
    // Fixed: Use correct job endpoint, not application endpoint
    const { data } = await axiosPrivate.post("department/", departmentData);

    const result = department_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      console.error("Response data:", data);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("Create department error:", error);
    throw error;
  }
};

export const retrieveDepartmentPrivate = async (
  axiosPrivate: any,
  id: number,
): Promise<department_type> => {
  try {
    const { data } = await axiosPrivate.get(`department/${id}/`);
    const result = department_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("Retrieve department error:", error);
    throw error;
  }
};

export const updateDepartmentPrivate = async (
  axiosPrivate: any,
  departmentData: department_type,
): Promise<department_type> => {
  try {
    // Fixed: Use correct job endpoint and fields
    const { data } = await axiosPrivate.patch(
      `department/${departmentData.id}/`,
      {
        title: departmentData.title,
        slug: departmentData.slug,
      },
    );

    const result = department_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("Update department error:", error);
    throw error;
  }
};

export const deleteDepartmentPrivate = async (
  axiosPrivate: any,
  id: number,
): Promise<void> => {
  try {
    await axiosPrivate.delete(`department/${id}/`);
  } catch (error) {
    console.error("Delete department error:", error);
    throw error;
  }
};
