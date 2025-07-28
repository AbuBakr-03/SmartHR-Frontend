/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from "zod";
import { job_schema } from "./jobapis";

// Schema for status
export const status_schema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
});

// Corrected application schema
export const application_schema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  residence: z.string(),
  cover_letter: z.string(),
  resume: z.string().nullable(), // File URLs/paths from API, not File objects
  match_score: z.number().nullable(),
  job: job_schema,
  status: status_schema,
});

const application_array_schema = z.array(application_schema);

export type application_type = z.infer<typeof application_schema>;

// Corrected post type - removed status_id (backend sets default)
// Update the application_post_type to handle File uploads
export type application_post_type = Omit<
  application_type,
  "id" | "job" | "status" | "match_score" | "resume"
> & {
  job_id: number;
  resume: File; // Change this to File for uploads
};

// Private functions (require auth) - Fixed endpoint consistency
export const listApplicationsPrivate = async (
  axiosPrivate: any,
): Promise<application_type[]> => {
  try {
    const { data } = await axiosPrivate.get("application/");
    const result = application_array_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("List applications error:", error);
    throw error;
  }
};

export const createApplicationPrivate = async (
  axiosPrivate: any,
  applicationData: application_post_type,
): Promise<application_type> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("name", applicationData.name);
    formData.append("email", applicationData.email);
    formData.append("residence", applicationData.residence);
    formData.append("cover_letter", applicationData.cover_letter);
    formData.append("job_id", applicationData.job_id.toString());

    // Append the file
    if (applicationData.resume) {
      formData.append("resume", applicationData.resume);
    }

    const { data } = await axiosPrivate.post("application/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const result = application_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("Create application error:", error);
    throw error;
  }
};

export const retrieveApplicationPrivate = async (
  axiosPrivate: any,
  id: number,
): Promise<application_type> => {
  try {
    const { data } = await axiosPrivate.get(`application/${id}/`);
    const result = application_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("Retrieve application error:", error);
    throw error;
  }
};

// Simplified update function
export const updateApplicationPrivate = async (
  axiosPrivate: any,
  applicationData: application_type,
): Promise<application_type> => {
  try {
    const { data } = await axiosPrivate.patch(
      `application/${applicationData.id}/`,
      {
        name: applicationData.name,
        email: applicationData.email,
        residence: applicationData.residence,
        cover_letter: applicationData.cover_letter,
        job_id: applicationData.job.id,
      },
    );

    const result = application_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("Update application error:", error);
    throw error;
  }
};

export const deleteApplicationPrivate = async (
  axiosPrivate: any,
  id: number,
): Promise<void> => {
  try {
    await axiosPrivate.delete(`application/${id}/`);
  } catch (error) {
    console.error("Delete application error:", error);
    throw error;
  }
};
