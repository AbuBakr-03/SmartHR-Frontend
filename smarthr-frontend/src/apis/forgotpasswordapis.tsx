import axios from "axios";

const API_URL = "http://127.0.0.1:8000/auth/users/reset_password/";

export const forgotpassword = async (email: string) => {
  const { data } = await axios.post(API_URL, { email });
  return data;
};
