// littlelemon/src/apis/loginapis.tsx - Debug Version
import axios from "axios";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const requestschema = z.object({
  username: z.string(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

const responseschema = z.object({
  access: z.string(),
  role: z.string(),
});

export type request = z.infer<typeof requestschema>;
export type response = z.infer<typeof responseschema>;

const BASE_URL = "http://127.0.0.1:8000/auth/jwt/create/";

export const login = async (details: request): Promise<response> => {
  try {
    const { data } = await axios.post(BASE_URL, details, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // Important: ensures HttpOnly cookies are set
    });

    const result = responseschema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      console.error("Login: Response validation error:", result.error);
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Login: Request failed", error);
    throw error;
  }
};
