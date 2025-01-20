import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'; 
import NavBar from './components/NavBar';
import Main from './components/Main';
import SignIn from './components/SignIn';
import Footer from './components/Footer';
import Register from './components/Register';
import SupervisorRegister from './components/SupervisorRegister'; 
import authService from './services/authService';
import EmployeeTimesheet from './components/EmployeeTimesheet';
import Dashboard from './components/Directory';
import TimesheetDetails from "./components/TimesheetDetails";
import ProtectedRoutes from './components/ProtectedRoutes';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isSignedIn());
  const [filteredData, setFilteredData] = useState([]);

  const ProtectedRoutes = ({ isAuthenticated }) => {
    if (!isAuthenticated) {
      return <Navigate to="/signin" replace />;
    }
    
    return <Outlet />;
  };

  return (
    <BrowserRouter>
      <NavBar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        setFilteredData={setFilteredData}
      />
      <div id="main-content">
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              authService.isSupervisor() ? (
                <Main
                  filteredData={filteredData}
                  setFilteredData={setFilteredData}
                  isAuthenticated={isAuthenticated}
                />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
 
        <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />

          <Route element={<ProtectedRoutes isAuthenticated={isAuthenticated} />}>
          <Route path="/directory" element={<Dashboard />} />
          <Route path="/timesheet/:id" element={<TimesheetDetails />} />
          <Route path="/timesheet" element={<EmployeeTimesheet />} />
          <Route
              path="/supervisor-register"
              element={
                authService.isSupervisor() ? (
                  <SupervisorRegister />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Route>
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
