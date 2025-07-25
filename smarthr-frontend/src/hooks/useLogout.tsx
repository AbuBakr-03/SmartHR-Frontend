// littlelemon/src/hooks/useLogout.tsx
import axios from "axios";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const authContext = useAuth();
  const { setAuth } = authContext;
  const navigate = useNavigate();

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
      await axios.post(
        "http://127.0.0.1:8000/auth/logout/",
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
