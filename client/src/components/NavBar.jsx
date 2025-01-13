import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";
import apiService from "../services/apiService";
import { Autocomplete, TextField } from "@mui/material";
import "../css/navbar.css";
import "../css/main.css";

const NavBar = ({ setFilteredData }) => {
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        const response = await apiService.getCoffees();
        setData(response);
        setFilteredData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCoffees();
  }, [setFilteredData]);

  const handleSearch = (value) => {
    setSearchTerm(value);

    const filteredData = data.filter((item) =>
      [item.coffeeName, item.origin, item.roastLevel]
        .map((field) => field?.toLowerCase() || "")
        .some((field) => field.includes(value.toLowerCase()))
    );

    setFilteredData(filteredData);
  };

  const handleSelectCoffee = (value) => {
    const selectedCoffee = data.find(
      (item) => item.coffeeName.toLowerCase() === value.toLowerCase()
    );

    if (selectedCoffee) {
      navigate(`/coffees/details/${selectedCoffee._id}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const toggleMenu = () => {
    const navMenu = document.querySelector(".nav-links-container");
    const background = document.querySelector(".background");

    navMenu.classList.toggle("open");
    background.classList.toggle("active");
  };

  useEffect(() => {
    const navMenu = document.querySelector(".nav-links-container");
    const mediaSize = 992;

    const collapseDropdownMenu = () => {
      const activeDropdown = navMenu.querySelector(
        ".dropdown-menu-branch.active"
      );
      if (activeDropdown) {
        const dropdownMenu = activeDropdown.querySelector(".dropdown-menu");
        dropdownMenu.removeAttribute("style");
        activeDropdown.classList.remove("active");
      }
    };

    const handleDropdownClick = (event) => {
      if (
        event.target.hasAttribute("data-toggle") &&
        window.innerWidth <= mediaSize
      ) {
        event.preventDefault();
        const dropdownMenuBranch = event.target.parentElement;

        if (dropdownMenuBranch.classList.contains("active")) {
          collapseDropdownMenu();
        } else {
          collapseDropdownMenu();
          dropdownMenuBranch.classList.add("active");
          const dropdownMenu =
            dropdownMenuBranch.querySelector(".dropdown-menu");
          dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + "px";
        }
      }
    };

    navMenu.addEventListener("click", handleDropdownClick);
    return () => {
      navMenu.removeEventListener("click", handleDropdownClick);
    };
  }, []);

  return (
    <div className="nav-container">
      <div className="nav-logo">
        <img
          src="/images/cofv10.svg"
          alt="Logo"
          onClick={() => navigate("/")}
        />
      </div>

      <div className={`background ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}></div>

      <div className="nav-links-container">
        <ul className="nav-links">
          <li className="nav-link-item dropdown-menu-branch">
            <a href="#" data-toggle="dropdown-menu">
              Coffee <i className="fa-solid fa-chevron-down"></i>
            </a>
            <ul className="dropdown-menu">
              <li className="column">
                <h4>Blends</h4>
                <ul>
                  <li>
                    <a href="#">Coffee 1</a>
                  </li>
                  <li>
                    <a href="#">Coffee 2</a>
                  </li>
                </ul>
              </li>
              <li className="column">
                <h4>Single Origin</h4>
                <ul>
                  <li>
                    <a href="#">Coffee A</a>
                  </li>
                  <li>
                    <a href="#">Coffee B</a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li className="nav-link-item">
            <Link to="/about">About</Link>
          </li>
          <li className="nav-link-item">
            <Link to="/timesheet">Timesheet</Link>
          </li>
          {isAuthenticated && (
            <li className="nav-link-item">
              <Link to="/coffees/create">Create Coffee</Link>
            </li>
          )}
        </ul>
      </div>

      <div className="nav-icons">
        {/* Search Bar */}
        <div className="search-bar-container">
          <Autocomplete
            freeSolo
            options={data.map((coffee) => coffee.coffeeName)}
            inputValue={searchTerm}
            onInputChange={(event, value) => handleSearch(value)}
            onChange={(event, value) => handleSelectCoffee(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search by coffee name..."
                variant="outlined"
                size="small"
                fullWidth
              />
            )}
            style={{ width: 300 }}
          />
        </div>

        {!isAuthenticated ? (
          <>
            <Link to="/register" className="nav-link-item">
              Register
            </Link>
            <Link to="/signin" className="nav-link-item">
              Sign In
            </Link>
          </>
        ) : (
          <button className="btn btn-link nav-link-item" onClick={handleLogout}>
            Logout
          </button>
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
