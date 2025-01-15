import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx"; // Assuming AuthContext is used
import "../css/navbar.css";
import "../css/main.css";

const NavBar = ({ setFilteredData }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(sessionStorage.getItem("type")); // Initialize from sessionStorage
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Effect to update `userRole` when sessionStorage changes (e.g., on login)
  useEffect(() => {
    const storedRole = sessionStorage.getItem("type");
    setUserRole(storedRole);
  }, [isAuthenticated]); // Re-run when authentication state changes

  const handleLogout = async () => {
    await logout();
    sessionStorage.removeItem("type"); // Clear user role from sessionStorage
    navigate("/signin");
  };

  const toggleMenu = () => {
    const navMenu = document.querySelector(".nav-links-container");
    const background = document.querySelector(".background");

    navMenu.classList.toggle("open");
    background.classList.toggle("active");
  };

  return (
    <div className="nav-container">
      <div className="nav-logo">
        <img src="/images/cofv10.svg" alt="Logo" onClick={() => navigate("/")} />
      </div>

      <div
        className={`background ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
      ></div>

      <div className="nav-links-container">
        <ul className="nav-links">
          <li className="nav-link-item">
            <Link to="/about">About</Link>
          </li>
          <li className="nav-link-item">
            <Link to="/timesheet">Timesheet</Link>
          </li>
          {isAuthenticated && (
            <li className="nav-link-item">
              <Link to="/employeeList">Research groups</Link>
            </li>
          )}
        </ul>
      </div>

      <div className="nav-icons">
        {!isAuthenticated ? (
          <Link to="/signin" className="nav-link-item">
            Sign In
          </Link>
        ) : (
          <>
            {userRole === "supervisor" && (
              <Link to="/supervisor-register" className="nav-link-item">
                Register Employee
              </Link>
            )}
            <button className="btn btn-link nav-link-item" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

        {!isMenuOpen ? (
          <i className="fa-solid fa-bars open-menu" onClick={toggleMenu}></i>
        ) : (
          <i className="fa-solid fa-xmark close-menu" onClick={toggleMenu}></i>
        )}
      </div>
    </div>
  );
};

export default NavBar;
