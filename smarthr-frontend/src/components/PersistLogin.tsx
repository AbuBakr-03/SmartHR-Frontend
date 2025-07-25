// littlelemon/src/components/PersistLogin.tsx - Production Ready
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "@/hooks/useRefreshToken";
import { useAuth } from "@/contexts/AuthProvider";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const authcontext = useAuth();
  const { auth } = authcontext;

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

    // If we don't have an access token, try to refresh
    if (!auth?.access) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []); // Keep empty dependency array

  return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
};

export default PersistLogin;
