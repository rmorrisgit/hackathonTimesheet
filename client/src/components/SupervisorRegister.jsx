import React, { useState } from "react";
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
  const { register: registerEmployee } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const navigate = useNavigate();
  const [registerMessage, setRegisterMessage] = useState("");

  const onSubmit = async (data) => {
    const payload = {
      employeeInfo: {
        employeeName: `${data.firstName} ${data.lastName}`,
        wNum: data.wNum || `W${Math.floor(100000 + Math.random() * 900000)}`,
        email: data.email,
        password: data.password,
        isAdmin: data.isAdmin || false,
      },
      block1: {
        fund: data.fund,
        dept: data.dept,
        program: data.program,
        acct: data.acct,
        project: data.project,
      },
      block2: {
        payPeriodStartDate: data.payPeriodStartDate,
        payPeriodEndDate: data.payPeriodEndDate,
      },
      block3: {
        hourlyRate: parseFloat(data.hourlyRate),
        isCasual: data.isCasual || false,
      },
      week1: {
        sun: { hours: 0, info: "" },
        mon: { hours: 0, info: "" },
        tue: { hours: 0, info: "" },
        wed: { hours: 0, info: "" },
        thu: { hours: 0, info: "" },
        fri: { hours: 0, info: "" },
        sat: { hours: 0, info: "" },
      },
      week2: {
        sun: { hours: 0, info: "" },
        mon: { hours: 0, info: "" },
        tue: { hours: 0, info: "" },
        wed: { hours: 0, info: "" },
        thu: { hours: 0, info: "" },
        fri: { hours: 0, info: "" },
        sat: { hours: 0, info: "" },
      },
    };

    const success = await registerEmployee(payload);
    if (success) {
      navigate("/employees");
    } else {
      setRegisterMessage("Failed to register employee. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, marginTop: "180px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Register Employee
      </Typography>

      {registerMessage && <Alert severity="error">{registerMessage}</Alert>}

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
