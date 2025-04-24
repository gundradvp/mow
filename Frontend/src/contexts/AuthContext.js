import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

// Create and export the useAuth hook
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          // Token is expired
          logout();
        } else {
          // Set user data from token
          const userData = {
            id: decodedToken.id,
            username: decodedToken.sub,
            role: decodedToken.role,
          };
          setCurrentUser(userData);

          // Set authorization header for all future requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Invalid token", error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post("/api/auth/login", {
        username,
        password,
      });
      const { token, userId, username: user, role } = response.data;

      localStorage.setItem("token", token);

      // Set authorization header for all future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const userData = {
        id: userId,
        username: user,
        role: role,
      };

      setCurrentUser(userData);
      return userData;
    } catch (error) {
      console.error("Login error", error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post("/api/auth/register", userData);
      return response.data;
    } catch (error) {
      console.error(
        "Registration error",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
