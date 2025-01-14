import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

const SupervisorRegister = () => {
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const [registerMessage, setRegisterMessage] = useState("");

  // Autofill form fields for testing
  useEffect(() => {
    setValue("firstName", "TestFirstName");
    setValue("lastName", "TestLastName");
    setValue("email", "testuser@example.com");
    setValue("password", "Password123!");
    setValue("confirmPassword", "Password123!");
    setValue("wNum", `W${Math.floor(100000 + Math.random() * 900000)}`);
    setValue("fund", "12345");
    setValue("dept", "IT");
    setValue("program", "CS101");
    setValue("acct", "98765");
    setValue("project", "TestProject");
    setValue("hourlyRate", 25);
  }, [setValue]);

  const onSubmit = async (data) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      wNum: data.wNum || `W${Math.floor(100000 + Math.random() * 900000)}`,
      fund: data.fund,
      dept: data.dept,
      program: data.program,
      acct: data.acct,
      project: data.project,
      hourlyRate: parseFloat(data.hourlyRate),
    };

    const success = await registerUser(payload);
    if (success) {
      setRegisterMessage("Registration successful. You can now log in.");
    } else {
      setRegisterMessage("Failed to register employee. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, marginTop: "180px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Register Employee
      </Typography>

      {registerMessage && (
        <Alert severity={registerMessage.includes("successful") ? "success" : "error"}>
          {registerMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            {...register("firstName", { required: "First Name is required" })}
            label="First Name"
            fullWidth
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
          <TextField
            {...register("lastName", { required: "Last Name is required" })}
            label="Last Name"
            fullWidth
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
          <TextField
            {...register("email", {
              required: "Email is required",
              pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" },
            })}
            label="Email"
            fullWidth
            autoComplete="off"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters long" },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                message: "Password must include uppercase, lowercase, number, and special character",
              },
            })}
            label="Password"
            type="password"
            fullWidth
            autoComplete="new-password"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            label="Confirm Password"
            type="password"
            fullWidth
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
          <TextField
            {...register("wNum")}
            label="W#"
            fullWidth
            placeholder="Enter W# (optional)"
          />
          <TextField
            {...register("fund")}
            label="Fund"
            fullWidth
            placeholder="Enter Fund Code"
          />
          <TextField
            {...register("dept")}
            label="Department"
            fullWidth
            placeholder="Enter Department Name"
          />
          <TextField
            {...register("program")}
            label="Program"
            fullWidth
            placeholder="Enter Program Code"
          />
          <TextField
            {...register("acct")}
            label="Account"
            fullWidth
            placeholder="Enter Account"
          />
          <TextField
            {...register("project")}
            label="Project"
            fullWidth
            placeholder="Enter Project Name"
          />
          <TextField
            {...register("hourlyRate", {
              required: "Hourly rate is required",
              valueAsNumber: true,
              validate: (value) => value > 0 || "Hourly rate must be a positive number",
            })}
            label="Hourly Rate"
            type="number"
            fullWidth
            error={!!errors.hourlyRate}
            helperText={errors.hourlyRate?.message}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register Employee
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default SupervisorRegister;
