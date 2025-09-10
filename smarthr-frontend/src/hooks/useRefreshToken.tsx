import { useAuth } from "@/contexts/AuthProvider";
import axios from "axios";

const useRefreshToken = () => {
  const authContext = useAuth();
  const { setAuth } = authContext;

  const refresh = async () => {
    try {
      console.log("useRefreshToken: Making refresh request...");
      const { data } = await axios.post(
        "https://api.smarthr.website/auth/jwt/refresh/",
        {}, // Empty body - refresh token comes from HttpOnly cookie
        {
          withCredentials: true, // Important: ensures cookies are sent
        },
      );

      console.log("useRefreshToken: Refresh response received:", data);

      // Update auth state with new access token and role
      setAuth((prev) => ({
        ...prev,
        access: data.access,
        role: data.role,
      }));

      console.log("useRefreshToken: Auth state updated successfully");
      return data.access;
    } catch (error) {
      console.error("useRefreshToken: Token refresh failed:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number; statusText?: string; data?: unknown };
        };
        console.error("useRefreshToken: Error details:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
        });
      }

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
