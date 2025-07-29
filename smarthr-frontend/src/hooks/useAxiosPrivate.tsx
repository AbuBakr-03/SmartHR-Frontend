// littlelemon/src/hooks/useAxiosPrivate.tsx - Optimized Version
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthProvider";
import useRefreshToken from "./useRefreshToken";

const axiosPrivate = axios.create({
  baseURL: "https://backend-production-a1cf.up.railway.app/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const useAxiosPrivate = () => {
  const authContext = useAuth();
  const { auth } = authContext;
  const refresh = useRefreshToken();

  // const axiosPrivate = useMemo(() => createAxiosPrivateInstance(), []);

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.access}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const prevRequest = error?.config;

        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;

          try {
            const newAccessToken = await refresh();
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [auth, refresh]); // Include axiosPrivate in deps

  return axiosPrivate;
};
export default useAxiosPrivate;
