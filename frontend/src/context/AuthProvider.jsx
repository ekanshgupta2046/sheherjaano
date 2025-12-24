import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken } from "@/api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    role: null,
    loading: true, 
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        //Refresh access token using cookie
        const res = await api.post("/auth/refresh");
        setAccessToken(res.data.accessToken);

        //Fetch current user
        const me = await api.get("/auth/me");

        setAuth({
          user: me.data,
          role: me.data.role,
          loading: false,
        });
      } catch (err) {
        setAuth({
          user: null,
          role: null,
          loading: false,
        });
      }
    };

    initAuth();
  }, []);

      const logout = async () => {
      try {
        await api.post("/auth/logout", {}, { withCredentials: true });
      } catch (err) {
        console.error("Logout failed", err);
      } finally {
        setAuth({
          user: null,
          role: null,
          loading: false,
        });
        setAccessToken(null);
      }
    };


      useEffect(() => {
      console.log("Auth state changed:");
    }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
