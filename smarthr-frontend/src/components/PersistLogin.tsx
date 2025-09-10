import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "@/hooks/useRefreshToken";
import { useAuth } from "@/contexts/AuthProvider";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const authcontext = useAuth();
  const { auth, persist } = authcontext;

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        console.log("PersistLogin: Attempting token refresh...");
        const newToken = await refresh();
        console.log(
          "PersistLogin: Token refresh successful:",
          newToken ? "Token received" : "No token",
        );
      } catch (err) {
        // Token refresh failed - user will be redirected to login
        console.error(
          `PersistLogin: Token refresh failed, user needs to log in:`,
          err,
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Only attempt token refresh if persist is enabled AND we don't have an access token
    console.log("PersistLogin: Checking conditions:", {
      persist,
      hasAccessToken: !!auth?.access,
      authState: auth,
    });

    if (persist && !auth?.access) {
      console.log("PersistLogin: Conditions met, attempting refresh...");
      verifyRefreshToken();
    } else {
      console.log("PersistLogin: Conditions not met, skipping refresh");
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [persist, refresh, auth?.access, auth]); // Include dependencies to re-run when persist or auth changes

  return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
};

export default PersistLogin;
