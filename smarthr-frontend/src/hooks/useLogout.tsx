// littlelemon/src/hooks/useLogout.tsx
import { useAuth } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "./useAxiosPrivate";

const useLogout = () => {
  const authContext = useAuth();
  const { setAuth } = authContext;
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate(); // Use authenticated axios instance

  const logout = async () => {
    // Clear auth state immediately
    setAuth({
      user: null,
      password: null,
      role: null,
      access: null,
      refresh: null,
    });

    try {
      // Call backend to clear HttpOnly cookie
      await axiosPrivate.post(
        "https://api.smarthr.website/auth/logout/",
        {},
        {
          withCredentials: true,
        },
      );
    } catch (err) {
      console.error("Logout error:", err);
      // Even if backend call fails, we've cleared the frontend state
    }

    // Redirect to home page
    navigate("/", { replace: true });
  };

  return logout;
};

export default useLogout;
