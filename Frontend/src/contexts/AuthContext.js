import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Demo users for static login
const DEMO_USERS = {
  driver1: {
    id: "d001",
    username: "driver1",
    role: "Driver", // Changed from Volunteer to Driver
    password: "Password123!",
    name: "John Driver",
    firstName: "John",
    lastName: "Driver",
    email: "driver1@mow.org",
  },
  volunteer1: {
    id: "v001",
    username: "volunteer1",
    role: "Volunteer",
    password: "Password123!",
    name: "Jane Volunteer",
    firstName: "Jane",
    lastName: "Volunteer",
    email: "volunteer1@mow.org",
  },
  admin: {
    id: "a001",
    username: "admin",
    role: "Admin",
    password: "Admin123!",
    name: "Admin User",
  },
  coordinator: {
    id: "c001",
    username: "coordinator",
    role: "Coordinator",
    password: "Coord123!",
    name: "Coordinator User",
  },
};

// Configure axios to avoid making actual API calls
axios.interceptors.request.use(
  (config) => {
    // If we see a request to the backend API, log it but don't actually send it
    if (config.url.includes("/api/")) {
      console.log("Mock API request:", config.method, config.url, config.data);
      return new Promise((resolve) => {
        // This effectively cancels the request but doesn't cause errors
      });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const AuthContext = createContext();

// Create and export the useAuth hook
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user in local storage
    const storedUser = localStorage.getItem("mockUser");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
      } catch (error) {
        console.error("Invalid stored user", error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);
  const login = async (username, password) => {
    // Simulate a delay for the login process
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Check if username exists in our demo users
    if (DEMO_USERS[username]) {
      // Check if password matches
      if (DEMO_USERS[username].password === password) {
        // Create user data object
        const userData = {
          id: DEMO_USERS[username].id,
          username: DEMO_USERS[username].username,
          role: DEMO_USERS[username].role,
          name: DEMO_USERS[username].name,
        };

        // Store user data in local storage
        localStorage.setItem("mockUser", JSON.stringify(userData));

        // Set current user
        setCurrentUser(userData);
        return userData;
      }
    }

    // If login fails
    throw new Error("Invalid username or password");
  };

  const register = async (userData) => {
    // Simulate a delay for the registration process
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For demo purposes, just log the registration attempt
    console.log("Registration attempted with data:", userData);

    // Return a mock success response
    return {
      success: true,
      message: "Registration successful. Please login.",
    };
  };

  const logout = () => {
    localStorage.removeItem("mockUser");
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
