/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { z } from "zod";

const BASE_URL = "http://127.0.0.1:8000/api/application/";

// Schema for category (nested in menu response)
const status_schema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
});

const company_schema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

const department_schema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
});

const job_schema = z.object({
  id: z.number(),
  title: z.string(),
  location: z.string(),
  responsiblities: z.string(),
  qualifications: z.string(),
  nice_to_haves: z.string(),
  end_date: z.coerce.date(),
  company: company_schema,
  department: department_schema,
});

const application_schema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  residence: z.string(),
  cover_letter: z.string(),
  resume: z.instanceof(File).nullable(),
  match_score: z.number().nullable(),
  job: job_schema,
  status: status_schema,
});

const application_array_schema = z.array(application_schema);

export type application_type = z.infer<typeof application_schema>;
export type application_post_type = Omit<
  application_type,
  "id" | "job" | "status"
> & {
  job_id: number;
  status_id: number;
  resume: File; // For file upload
};

// Public functions (no auth required)
export const listApplications = async (): Promise<application_type[]> => {
  try {
    const { data } = await axios.get(BASE_URL);
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

// Private functions (require auth)
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
    formData.append(
      "match_score",
      applicationData.match_score?.toString() || (0).toString(),
    );

    formData.append("job_id", applicationData.job_id.toString());
    formData.append("status_id", applicationData.status_id.toString());
    formData.append("resume", applicationData.resume);

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
      console.error("Response data:", data);
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

export const updateApplicationPrivate = async (
  axiosPrivate: any,
  applicationData: application_type,
): Promise<application_type> => {
  try {
    const { data } = await axiosPrivate.patch(
      `application/${applicationData.id}/`,
      {
        cover_letter: applicationData.cover_letter,
        email: applicationData.email,
        name: applicationData.name,
        residence: applicationData.residence,
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

// Legacy functions for backward compatibility (keeping for public use)
export const createApplication = async (
  applicationData: application_post_type,
): Promise<application_type> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("name", applicationData.name);
    formData.append("email", applicationData.email);
    formData.append("residence", applicationData.residence);
    formData.append("cover_letter", applicationData.cover_letter);
    formData.append(
      "match_score",
      applicationData.match_score?.toString() || (0).toString(),
    );

    formData.append("job_id", applicationData.job_id.toString());
    formData.append("status_id", applicationData.status_id.toString());
    formData.append("resume", applicationData.resume);

    const { data } = await axios.post(BASE_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const result = application_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      console.error("Response data:", data);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("Create application error:", error);
    throw error;
  }
};

export const retrieveApplication = async (
  id: number,
): Promise<application_type> => {
  try {
    const { data } = await axios.get(`${BASE_URL}${id}/`);
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

export const updateApplication = async (
  applicationData: application_type,
): Promise<application_type> => {
  try {
    const { data } = await axios.patch(`${BASE_URL}${applicationData.id}/`, {
      cover_letter: applicationData.cover_letter,
      email: applicationData.email,
      name: applicationData.name,
      residence: applicationData.residence,
      job_id: applicationData.job.id,
    });

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

export const deleteApplication = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}${id}/`);
  } catch (error) {
    console.error("Delete application error:", error);
    throw error;
  }
};
