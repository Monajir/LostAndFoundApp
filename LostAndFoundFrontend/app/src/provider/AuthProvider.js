import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { Navigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return authContext;
};

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(token));

  // Sync token with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [token]);

  // Fetch and validate token
  useEffect(() => {
    const fetchMe = async () => {
      // This part avoid unnecessary api calls when I don't have any tokens in local storage, i.e. its expired or user logged out.
      const storedToken = localStorage.getItem("accessToken");
      if(!storedToken){
        setLoading(false);
        return;
      }
 
      try {
        const response = await axios.get("http://localhost:8081/token/me");
        setToken(response.data.accessToken);
      } catch (error) {
        console.error("Token validation failed", error);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  // Attach tokens to axios requests
  useLayoutEffect(() => {
    const authInterceptor = axios.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
      return config;
    });

    return () => {
      axios.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  // Handle expired or invalid tokens during requests
  useEffect(() => {
    const authInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error("Token expired or invalid.");
          setToken(null);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(authInterceptor);
    };
  }, [token]);

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("accessToken");
    setToken(null); // Clear the token
    // You can also perform additional cleanup, like notifying the server.
  };

//   const isAuthenticated = Boolean(token); // Upore state hishebe niye gesi

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, setToken, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
