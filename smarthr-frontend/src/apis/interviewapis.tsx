import { application_schema } from "@/apis/applicationapis";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from "zod";

export const result_schema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
});

// Make analysis_data more flexible to handle dynamic JSON
export const analysis_data_schema = z.any().nullable();
// Since analysis_data is a Django JSONField that can contain any JSON structure (objects, arrays, primitives), z.any().nullable() is the most appropriate choice. This allows the field to be:
// null (when no analysis has been done)
// Any valid JSON structure (object, array, string, number, boolean)

export const interview_question_schema = z.object({
  category: z.string(),
  question: z.string(),
});

export const interview_schema = z.object({
  id: z.number(),
  application: application_schema,
  date: z.coerce.date().nullable(),
  result: result_schema,
  external_meeting_link: z.string().nullable(),
  interview_video: z.string().nullable(),
  analysis_data: analysis_data_schema.optional(),
  // Fixed: Changed from 'interview_question' to 'interview_questions' to match model
  interview_questions: z.array(interview_question_schema).nullable().optional(),
});

const interview_array_schema = z.array(interview_schema);

export type interview_type = z.infer<typeof interview_schema>;

// Corrected post type - removed status_id (backend sets default)
export type interview_post_type = Omit<
  interview_type,
  "id" | "application" | "result" | "analysis_data" | "interview_questions"
> & {
  application_id: number;
  date?: string | null;
  external_meeting_link?: string | null;
  interview_video?: File | null;
};

export type interview_put_type = Omit<
  interview_type,
  "application" | "result" | "analysis_data" | "interview_questions"
> & {
  application_id: number;
  date?: string | null;
  external_meeting_link?: string | null;
  interview_video?: File | null;
};

// Private functions (require auth) - Fixed endpoint consistency
export const listInterviewsPrivate = async (
  axiosPrivate: any,
): Promise<interview_type[]> => {
  try {
    const { data } = await axiosPrivate.get("interview/");
    const result = interview_array_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("List interviews error:", error);
    throw error;
  }
};

export const createInterviewPrivate = async (
  axiosPrivate: any,
  interviewData: interview_post_type,
): Promise<interview_type> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("application_id", interviewData.application_id.toString());

    if (interviewData.date) {
      formData.append("date", interviewData.date);
    }

    if (interviewData.external_meeting_link) {
      formData.append(
        "external_meeting_link",
        interviewData.external_meeting_link,
      );
    }

    if (interviewData.interview_video) {
      formData.append("interview_video", interviewData.interview_video);
    }

    const { data } = await axiosPrivate.post("interview/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const result = interview_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      console.error("Response data:", data);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("Create interview error:", error);
    throw error;
  }
};

export const retrieveInterviewPrivate = async (
  axiosPrivate: any,
  id: number,
): Promise<interview_type> => {
  try {
    const { data } = await axiosPrivate.get(`interview/${id}/`);
    const result = interview_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("Retrieve interview error:", error);
    throw error;
  }
};

// Simplified update function
export const updateInterviewPrivate = async (
  axiosPrivate: any,
  interviewData: interview_put_type,
): Promise<interview_type> => {
  try {
    const formData = new FormData();
    formData.append("application_id", interviewData.application_id.toString());

    if (interviewData.date) {
      formData.append("date", interviewData.date);
    }

    if (interviewData.external_meeting_link) {
      formData.append(
        "external_meeting_link",
        interviewData.external_meeting_link,
      );
    }

    if (interviewData.interview_video) {
      formData.append("interview_video", interviewData.interview_video);
    }

    const { data } = await axiosPrivate.patch(
      `interview/${interviewData.id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const result = interview_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("Update interview error:", error);
    throw error;
  }
};

export const deleteInterviewPrivate = async (
  axiosPrivate: any,
  id: number,
): Promise<void> => {
  try {
    await axiosPrivate.delete(`interview/${id}/`);
  } catch (error) {
    console.error("Delete interview error:", error);
    throw error;
  }
};

// Enhanced schema for interview recording analysis
const interview_recording_schema = z.object({
  success: z.boolean(),
  message: z.string(),
  emotions: z.record(z.string(), z.number()).optional(),
  confidence: z.number().optional(),
  result_id: z.number().optional(),
  result_title: z.string().optional(),
});

export type interview_recording_type = z.infer<
  typeof interview_recording_schema
>;

// Function to analyze a previously uploaded video
export const analyzeInterviewRecordingPrivate = async (
  axiosPrivate: any,
  id: number,
): Promise<interview_recording_type> => {
  console.log("Starting analysis for interview ID:", id);

  try {
    const { data } = await axiosPrivate.post(
      `interview/${id}/analyze-recording/`,
      { interview_id: id },
    );

    const result = interview_recording_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("Error occurred during recording analysis:", error);
    throw new Error("An error occurred during analysis. Please try again.");
  }
};

const generate_interview_schema = z.object({
  success: z.boolean(),
  message: z.string(),
  questions: z
    .array(
      z.object({
        category: z.string(),
        question: z.string(),
      }),
    )
    .optional(),
});

export type generate_interview_type = z.infer<typeof generate_interview_schema>;

// Function to generate interview questions from resume
export const generateInterviewQuestions = async (
  axiosPrivate: any,
  id: number,
): Promise<generate_interview_type> => {
  console.log("Starting question generation for interview ID:", id);

  try {
    const { data } = await axiosPrivate.post(
      `interview/${id}/generate-questions/`,
      { interview_id: id },
    );

    const result = generate_interview_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("Error occurred during question generation:", error);
    throw new Error(
      "An error occurred while generating questions. Please try again.",
    );
  }
};
