import React, { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/authService";

// Create AuthContext
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isSignedIn());

  const login = async (credentials) => {
    const success = await authService.SignIn(credentials);
    setIsAuthenticated(success);
    return success;
  };

  const register = async (formData) => {
    const registerResponse = await authService.register(formData);
    if (registerResponse.success) {
      // Return success without logging in the registered user
      return true;
    }
    return false; // Registration failed
  };

  const logout = async () => {
    await authService.signOut();
    setIsAuthenticated(false);
  };

  const refreshAuthState = () => {
    setIsAuthenticated(authService.isSignedIn());
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout, refreshAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
