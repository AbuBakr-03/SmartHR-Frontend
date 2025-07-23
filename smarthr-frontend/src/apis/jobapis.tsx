import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/job/";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from "zod";

// Schema for company
const company_schema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

// Schema for department
const department_schema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
});

// Schema for user (recruiter)
const user_schema = z.object({
  id: z.number(),
  username: z.string(),
});

// Corrected job schema - matches serializer output
const job_schema = z.object({
  id: z.number(),
  title: z.string(),
  location: z.string(),
  responsiblities: z.string(), // Note: keeping the typo as it exists in the model
  qualification: z.string(), // Fixed: removed 's'
  nice_to_haves: z.string(),
  end_date: z.coerce.date(),
  company: company_schema,
  department: department_schema,
  recruiter: user_schema.nullable(), // Added missing recruiter field
});

const job_array_schema = z.array(job_schema);

export type job_type = z.infer<typeof job_schema>;

// Corrected post type - removed status_id (backend sets default)
export type job_post_type = Omit<
  job_type,
  "id" | "company" | "department" | "recruiter"
> & {
  company_id: number;
  department_id: number;
};

// Private functions (require auth) - Fixed endpoint consistency
export const listJobsPrivate = async (
  axiosPrivate: any,
): Promise<job_type[]> => {
  try {
    const { data } = await axiosPrivate.get("job/");
    const result = job_array_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("List jobs error:", error);
    throw error;
  }
};

export const createJobPrivate = async (
  axiosPrivate: any,
  jobData: job_post_type,
): Promise<job_type> => {
  // Removed status_id and match_score - backend handles these

  const { data } = await axiosPrivate.post("application/", jobData);
  const result = job_schema.safeParse(data);
  if (result.success) {
    return result.data;
  } else {
    console.error("Validation error:", result.error);
    console.error("Response data:", data);
    throw new Error("Failed to validate response data");
  }
};

export const retrieveJobPrivate = async (
  axiosPrivate: any,
  id: number,
): Promise<job_type> => {
  try {
    const { data } = await axiosPrivate.get(`job/${id}/`);
    const result = job_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("Retrieve job error:", error);
    throw error;
  }
};

// Simplified update function
export const updateJobPrivate = async (
  axiosPrivate: any,
  jobData: job_type,
): Promise<job_type> => {
  try {
    const { data } = await axiosPrivate.patch(`application/${jobData.id}/`, {
      title: jobData.title,
      location: jobData.location,
      company_id: jobData.company.id,
      department_id: jobData.department.id,
      responsiblities: jobData.responsiblities,
      qualification: jobData.qualification,
      nice_to_haves: jobData.nice_to_haves,
      end_date: jobData.end_date,
    });

    const result = job_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("Update job error:", error);
    throw error;
  }
};

export const deleteJobPrivate = async (
  axiosPrivate: any,
  id: number,
): Promise<void> => {
  try {
    await axiosPrivate.delete(`job/${id}/`);
  } catch (error) {
    console.error("Delete job error:", error);
    throw error;
  }
};
