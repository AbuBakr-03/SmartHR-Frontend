import React, { createContext, useContext, useState } from "react";

type childrenType = {
  children: React.ReactNode;
};

type AuthState = {
  access: string | null;
  refresh: string | null;
  password: string | null;
  user: string | null;
  role: string | null;
};

type AuthContextType = {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  persist: boolean;
  setPersist: React.Dispatch<React.SetStateAction<boolean>>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

const AuthProvider = ({ children }: childrenType) => {
  const [auth, setAuth] = useState<AuthState>({
    access: null,
    refresh: null,
    password: null,
    user: null,
    role: null,
  });

  const [persist, setPersist] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("persist");
      // Check for null, empty string, or "undefined" string
      if (!stored || stored === "undefined" || stored === "") {
        return false;
      }
      return JSON.parse(stored);
    } catch (error) {
      console.warn("Failed to parse persist from localStorage:", error);
      // Clean up the corrupted localStorage entry
      localStorage.removeItem("persist");
      return false;
    }
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
