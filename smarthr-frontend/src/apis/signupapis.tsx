import axios from "axios";
import z from "zod";
const BASE_URL = "http://127.0.0.1:8000/auth/users/";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const schema = z.object({
  username: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters long." })
    .max(50, { message: "Full name must be 50 characters or fewer." }),
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});
const responseSchema = z.object({
  email: z.email(),
  username: z.string(),
});
export type request_schema = z.infer<typeof schema>;
export type response_schema = z.infer<typeof responseSchema>;
export const signup = async (
  details: request_schema,
): Promise<response_schema> => {
  try {
    const { data } = await axios.post(BASE_URL, details);
    const result = responseSchema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error(result.error);
      throw new Error();
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
