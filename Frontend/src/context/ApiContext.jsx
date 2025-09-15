import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api.js";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  const [authStatus, setAuthStatus] = useState(null);
  const [loading, setLoading] = useState(true); // To avoid flicker on refresh

  useEffect(() => {
 //   console.log("ApiProvider mounted, checking auth...");
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await API.get(`${BACKEND_URL}/auth/status`, {
        withCredentials: true,
      });
    //  console.log("✅ Response from checkAuth:", response.data);
      setAuthStatus(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      console.error("❌ Auth check failed", error);
      setAuthStatus(null);
      setLoading(false);
      return null;
    }
  };

  return (
    <ApiContext.Provider value={{ checkAuth, authStatus, setAuthStatus, loading }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);