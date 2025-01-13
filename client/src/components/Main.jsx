import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/main.css";
import Card from "./Card";
import apiService from "../services/apiService"; // Assuming this fetches data from the backend

const Main = ({ filteredData, setFilteredData, isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Used to track route changes

  // Fetch data whenever the route changes or the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.getCoffees(); // Fetch updated data
        setFilteredData(response); // Update the filteredData state with the latest data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location.pathname, setFilteredData]); // Re-run on route change or component mount

  const handleView = (id, index) => {
    navigate(`/coffees/details/${id}?index=${index}`);
  };

  const handleEdit = (id) => {
    navigate(`/coffees/edit/${id}`);
  };

  const handleDelete = (id, index) => {
    navigate(`/coffees/delete-confirmation/${id}?index=${index}`);
  };

  return (
    <div>
      <div
        className="album gridCon pt-4"
        style={{
          padding: 0,
          backgroundColor: "hsla(215, 15%, 97%, 0.5)",
          paddingBottom: "250px",
        }}
      >
        <div
          className="col-12"
          style={{
            padding: 0,
            display: "flex",
            paddingTop: "200px",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <div className="col-lg-1 col-xl-1 d-none d-lg-block"></div>
          <div
            className="row col-xl-9 col-xs-12 mt-4"
            style={{ margin: "auto" }}
          >
            {filteredData.map((item, idx) => (
              <div
                key={item._id}
                className="col-xs-12 col-md-6 col-xxl-2 col-xxxl-2 col-xxxxl-2"
              >
                <Card
                  index={idx}
                  text={item.coffeeName}
                  roastLevel={item.roastLevel}
                  image={item.image}
                  origin={item.origin}
                  isAuthenticated={isAuthenticated}
                  onView={() => handleView(item._id, idx)}
                  onEdit={() => handleEdit(item._id)}
                  onDelete={() => handleDelete(item._id, idx)}
                />
              </div>
            ))}
            {filteredData.length === 0 && (
              <div
                className="text-center"
                style={{ color: "white", marginTop: "20px" }}
              >
                <p>No results found.</p>
              </div>
            )}
          </div>
          <div className="col-lg-1 d-none d-lg-block"></div>
        </div>
      </div>
      <div className="col-lg-12 p-5"></div>
    </div>
  );
};

export default Main;
