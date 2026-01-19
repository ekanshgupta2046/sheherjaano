import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken } from "@/api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    loading: true,
  });

  // ONE function, ONE responsibility
  const initAuth = async () => {
    try {
      const res = await api.post("/auth/refresh", {}, { withCredentials: true });
      setAccessToken(res.data.accessToken);

      const me = await api.get("/auth/me");

      setAuth({
        user: me.data,
        loading: false,
      });
    } catch {
      setAuth({
        user: null,
        loading: false,
      });
      setAccessToken(null);
    }
  };

  // Run once on app load
  useEffect(() => {
    initAuth();
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } finally {
      setAuth({
        user: null,
        loading: false,
      });
      setAccessToken(null);
    }
  };

  const login = (userData, accessToken) => {
    setAccessToken(accessToken); // 1. Set the token for Axios
    setAuth({                    // 2. Update React State
      user: userData,
      loading: false, 
    });
  };

  const updateUser = (updates) => {
  setAuth((prev) => ({
    ...prev,
    user: {
      ...prev.user,
      ...updates,
    },
  }));
};

  return (
    <AuthContext.Provider value={{ auth, initAuth, logout, login, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
