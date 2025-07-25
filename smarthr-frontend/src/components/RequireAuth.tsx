// littlelemon/src/components/RequireAuth.tsx
import { useAuth } from "@/contexts/AuthProvider";
import { useLocation, Outlet, Navigate } from "react-router-dom";

type roleType = {
  allowedRole: string;
};

const RequireAuth = ({ allowedRole }: roleType) => {
  const authContext = useAuth();
  const { auth } = authContext;
  const location = useLocation();

  // Check if user has the required role
  if (auth?.role === allowedRole) {
    return <Outlet />;
  }

  // If user exists but wrong role, redirect to unauthorized
  if (auth?.user) {
    return <Navigate to={"/unauthorized"} state={{ from: location }} replace />;
  }

  // No user, redirect to login
  return <Navigate to={"/log-in"} state={{ from: location }} replace />;
};

export default RequireAuth;
