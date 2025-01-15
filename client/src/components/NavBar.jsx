import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";
import UserService from "../services/userService"; // Import UserService
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import "../css/navbar.css";
import "../css/main.css";

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(sessionStorage.getItem("type"));
  const [userName, setUserName] = useState(null); // State for the user's name
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch user data when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      // Fetch user details from UserService
      UserService.getUserData()
        .then((data) => {
          setUserName(data.firstName); // Use `firstName` from API response
        })
        .catch((err) => {
          console.error("Failed to fetch user data:", err);
          setUserName("User"); // Fallback to "User" on error
        });
    } else {
      setUserName(null); // Clear name when not authenticated
    }
  }, [isAuthenticated]);

  // Update role from sessionStorage on login/logout
  useEffect(() => {
    const storedRole = sessionStorage.getItem("type");
    setUserRole(storedRole);
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    sessionStorage.removeItem("type");
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
      {/* Logo and Greeting */}
      <div className="nav-logo">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <i className="fa fa-2x fa-clock" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}></i>

        {isAuthenticated && userName && (
          <Typography
            variant="h6"
            sx={{
              marginLeft: "20px",
              display: "inline-block",
              color: "primary.main",
              fontWeight: "bold",
            }}
          >
            Welcome, {userName}
          </Typography>
        )}
      </div>

      {/* Background Overlay for Menu */}
      <div
        className={`background ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
      ></div>

      {/* Navigation Links */}
      <div className="nav-links-container">
        <ul className="nav-links">
          <li className="nav-link-item">
            <Typography variant="body1" component={Link} to="/about">
              About
            </Typography>
          </li>
          <li className="nav-link-item">
            <Typography variant="body1" component={Link} to="/timesheet">
              Timesheet
            </Typography>
          </li>
          {isAuthenticated && (
            <li className="nav-link-item">
              <Typography variant="body1" component={Link} to="/employeeList">
                Research Groups
              </Typography>
            </li>
          )}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="nav-icons">
        {!isAuthenticated ? (
          <Chip
            label="Sign In"
            color="primary"
            onClick={() => navigate("/signin")}
            className="nav-chip"
          />
        ) : (
          <>
            {userRole === "supervisor" && (
              <Typography
                variant="body1"
                onClick={() => navigate("/supervisor-register")}
                className="nav-chip"
                sx={{
                  cursor: "pointer",
                  color: "primary.main",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "1px solid",
                  borderColor: "primary.main",
                  display: "inline-block",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  marginRight: "25px",
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "#fff",
                  },
                }}
              >
                Register Employee
              </Typography>
            )}
            <Chip
              label="Logout"
              color="primary"
              onClick={handleLogout}
              className="LogoutChip nav-chip"
            />
          </>
        )}

        {/* Mobile Menu Toggle Icons */}
        {!isMenuOpen ? (
          <i
            className="fa-solid fa-bars open-menu"
            onClick={toggleMenu}
            style={{ cursor: "pointer" }}
          ></i>
        ) : (
          <i
            className="fa-solid fa-xmark close-menu"
            onClick={toggleMenu}
            style={{ cursor: "pointer" }}
          ></i>
        )}
      </div>
    </div>
  );
};

export default NavBar;
