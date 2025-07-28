import axios from "axios";
import z from "zod";

const API_URL = "http://127.0.0.1:8000/auth/users/reset_password/";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const forgot_schema = z.object({
  email: z.email(),
});

type forgot_type = z.infer<typeof forgot_schema>;

export const forgotpassword = async (email: forgot_type) => {
  const { data } = await axios.post(API_URL, { email });
  return data;
};
