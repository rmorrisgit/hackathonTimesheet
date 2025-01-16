import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import NavBar from './components/NavBar';
import Main from './components/Main';
import SignIn from './components/SignIn';
import Footer from './components/Footer';
import Register from './components/Register';
import SupervisorRegister from './components/SupervisorRegister'; 
// import Dummy from './components/Dummy';
import ProtectedRoutes from './components/ProtectedRoutes';
// import CreateForm from './components/CreateForm';
import CoffeeDetails from './components/coffees/CoffeeDetails';
// import EditCoffeeForm from './components/coffees/EditCoffeeForm';
// import DeleteConfirmation from './components/DeleteConfirmation';
import authService from './services/authService';
import EmployeeTimesheet from './components/EmployeeTimesheet';
import Dashboard from './components/Directory';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isSignedIn());
  const [filteredData, setFilteredData] = useState([]);

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
              <Main
                filteredData={filteredData}
                setFilteredData={setFilteredData}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route path="/timesheet" element={<EmployeeTimesheet />} />
          <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />

          <Route path="/coffees/details/:coffeeId" element={<CoffeeDetails />} />
          <Route element={<ProtectedRoutes isAuthenticated={isAuthenticated} />}>
            
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
            {/* <Route path="/coffees/create" element={<CreateForm />} /> */}
            <Route path="/directory" element={<Dashboard />} />
            {/* <Route path="/coffees/edit/:coffeeId" element={<EditCoffeeForm />} /> */}
            {/* <Route path="/coffees/delete-confirmation/:coffeeId" element={<DeleteConfirmation />} /> */}
            {/* <Route path="/dummy" element={<Dummy />} /> */}
          </Route>
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
