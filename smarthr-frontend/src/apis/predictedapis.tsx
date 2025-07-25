// frontend/src/APIs/PredictedCandidateApi.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

import { status_schema } from "./applicationapis";

import { interview_schema } from "./interviewapis";

const predicted_schema = z.object({
  id: z.number(),
  interview: interview_schema,
  status: status_schema,
  evaluation_score: z.number().nullable(),
  evaluation_data: z.any().nullable(),
});

const predicted_array_schema = z.array(predicted_schema);

export type predicted_type = z.infer<typeof predicted_schema>;

const question_schema = z.object({
  question: z.string(),
  score: z.number(),
  category: z.string(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const evaluation_schema = z.object({
  questions: z.array(question_schema),
  comments: z.string(),
});

export type evaluation_type = z.infer<typeof evaluation_schema>;

const evaluation_response_schema = z.object({
  success: z.boolean(),
  message: z.string(),
  status: z.string(),
  average_score: z.number(),
});

export type evaluation_response_type = z.infer<
  typeof evaluation_response_schema
>;

export const submitEvaluation = async (
  axiosPrivate: any,
  id: number,
  evaluationData: evaluation_type,
): Promise<evaluation_response_type> => {
  try {
    const { data } = await axiosPrivate.post(
      `predicted-candidates/${id}/evaluate/`,
      {
        evaluation_data: evaluationData,
      },
    );
    const result = evaluation_response_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Private functions (require auth) - Fixed endpoint consistency
export const listPredictionsPrivate = async (
  axiosPrivate: any,
): Promise<predicted_type[]> => {
  try {
    const { data } = await axiosPrivate.get("predicted-candidates/");
    const result = predicted_array_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("List predictions error:", error);
    throw error;
  }
};

export const retrievePredictionPrivate = async (
  axiosPrivate: any,
  id: number,
): Promise<predicted_type> => {
  try {
    const { data } = await axiosPrivate.get(`predicted-candidates/${id}/`);
    const result = predicted_schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Validation error:", result.error);
      throw new Error("Failed to validate response data");
    }
  } catch (error) {
    console.error("Retrieve prediction error:", error);
    throw error;
  }
};

export const deletePredictionPrivate = async (
  axiosPrivate: any,
  id: number,
): Promise<void> => {
  try {
    await axiosPrivate.delete(`predicted-candidates/${id}/`);
  } catch (error) {
    console.error("Delete prediction error:", error);
    throw error;
  }
};
