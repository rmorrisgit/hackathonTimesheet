import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import {
  Card as MUICard,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import apiService from "../services/apiService";

const DeleteConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const coffeeId = location.pathname.split("/").pop();

  const [coffee, setCoffee] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoffee = async () => {
      try {
        const coffeeData = await apiService.getCoffeeById(coffeeId);
        setCoffee(coffeeData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching coffee details:", err);
        setError("Failed to fetch coffee details.");
        setLoading(false);
      }
    };

    fetchCoffee();
  }, [coffeeId]);

  const handleDelete = async () => {
    try {
      await apiService.deleteCoffee(coffeeId);
      navigate("/"); // Redirect after deletion
    } catch (err) {
      console.error("Error deleting coffee:", err);
      setError("Failed to delete the coffee. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/"); // Navigate back to home page
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <MUICard
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 6,
        p: 3,
        marginTop: "170px",
        borderRadius: 2,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h5" gutterBottom align="center">
        Delete Confirmation
      </Typography>

      {/* Coffee Image */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
        }}
      >
        <CardMedia
          component="img"
          alt={coffee.coffeeName || "Coffee Image"}
          sx={{
            height: 130,
            width: "auto",
            objectFit: "contain",
          }}
          src={coffee.image || "/images/fallback.svg"}
          onError={(e) => {
            console.error(`Failed to load image: ${coffee.image}`);
            e.target.src = "/images/fallback.svg";
          }}
        />
      </Box>

      {/* Card Content */}
      <CardContent
        sx={{
          padding: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {coffee.coffeeName}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Origin:</strong> {coffee.origin}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Are you sure you want to delete this coffee? This action cannot be
          undone.
        </Typography>
      </CardContent>

      {/* Card Actions */}
      {isAuthenticated && (
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            paddingTop: 2,
            borderTop: "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <Tooltip title="Delete this coffee permanently">
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              sx={{ textTransform: "none" }}
            >
              Delete
            </Button>
          </Tooltip>
          <Tooltip title="Cancel and return to the homepage">
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCancel}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
          </Tooltip>
        </CardActions>
      )}
    </MUICard>
  );
};

export default DeleteConfirmation;
