import axios from "axios";
import z from "zod";

const API_URL =
  "https://backend-production-a1cf.up.railway.app/auth/users/reset_password_confirm/";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const reset_schema = z.object({
  new_password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      "Must include uppercase, lowercase, number & symbol",
    ),
  uid: z.string(),
  token: z.string(),
});

type reset_type = z.infer<typeof reset_schema>;

export const resetpassword = async (reset: reset_type) => {
  const { data } = await axios.post(API_URL, reset);
  return data;
};
