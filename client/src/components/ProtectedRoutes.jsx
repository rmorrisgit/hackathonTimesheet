import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoutes = () => {
  // Check if the user is signed in using the authService
  const isAuthenticated = authService.isSignedIn();

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoutes;
