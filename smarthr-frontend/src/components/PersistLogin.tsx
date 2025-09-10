import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "@/hooks/useRefreshToken";
import { useAuth } from "@/contexts/AuthProvider";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const authcontext = useAuth();
  const { persist } = authcontext;

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        // Token refresh failed - user will be redirected to login
        console.log(
          `PersistLogin: Token refresh failed, user needs to log in ${err}`,
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Always attempt token refresh if persist is enabled (auth.access is always null on page load)
    if (persist) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [persist, refresh]); // Include dependencies to re-run when persist changes

  return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
};

export default PersistLogin;
