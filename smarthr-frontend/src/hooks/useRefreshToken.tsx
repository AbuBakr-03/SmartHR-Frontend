import { useAuth } from "@/contexts/AuthProvider";
import axios from "axios";

const useRefreshToken = () => {
  const authContext = useAuth();
  const { setAuth } = authContext;

  const refresh = async () => {
    try {
      const { data } = await axios.post(
        "http://127.0.0.1:8000/auth/jwt/refresh/",
        {}, // Empty body - refresh token comes from HttpOnly cookie
        {
          withCredentials: true, // Important: ensures cookies are sent
        },
      );

      // Update auth state with new access token and role
      setAuth((prev) => ({
        ...prev,
        access: data.access,
        role: data.role,
      }));

      return data.access;
    } catch (error) {
      console.error("Token refresh failed:", error);

      // Clear auth state on refresh failure
      setAuth({
        access: null,
        refresh: null,
        password: null,
        user: null,
        role: null,
      });

      throw error;
    }
  };

  return refresh;
};

export default useRefreshToken;
