import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

const SupervisorRegister = () => {
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm();
  const navigate = useNavigate();
  const [registerMessage, setRegisterMessage] = useState("");

  // Autofill form fields for testing
  useEffect(() => {
    const autofillValues = {
      firstName: "TestFirstName",
      lastName: "TestLastName",
      email: "testuser@example.com",
      password: "Password123!",
      confirmPassword: "Password123!",
      wNum: `W${Math.floor(100000 + Math.random() * 900000)}`,
      fund: "12345",
      dept: "IT",
      program: "CS101",
      acct: "98765",
      project: "TestProject",
      hourlyRate: 25,
      contractStartDate: "2025-01-01",
      contractEndDate: "2025-01-14",
      assignmentType: "Casual",
    };

    for (const key in autofillValues) {
      setValue(key, autofillValues[key]);
    }
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
      contractStartDate: data.contractStartDate || null,
      contractEndDate: data.contractEndDate || null,
      assignmentType: data.assignmentType || null,
    };

    const success = await registerUser(payload);
    setRegisterMessage(
      success
        ? "Registration successful. You can now log in."
        : "Failed to register employee. Please try again."
    );
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 20 , mb: 5}}>
      <Typography variant="h4" align="center" gutterBottom>
        Register Employee
      </Typography>

      {registerMessage && (
        <Alert severity={registerMessage.includes("successful") ? "success" : "error"}>
          {registerMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
              validate: (value) => value === watch("password") || "Passwords do not match",
            })}
            label="Confirm Password"
            type="password"
            fullWidth
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
          <TextField
            {...register("wNum", { required: "W Number is required" })}
            label="W Number"
            fullWidth
            error={!!errors.wNum}
            helperText={errors.wNum?.message}
          />
          <TextField
            {...register("fund", { required: "Fund is required" })}
            label="Fund"
            fullWidth
            error={!!errors.fund}
            helperText={errors.fund?.message}
          />
          <TextField
            {...register("dept", { required: "Department is required" })}
            label="Department"
            fullWidth
            error={!!errors.dept}
            helperText={errors.dept?.message}
          />
          <TextField
            {...register("program", { required: "Program is required" })}
            label="Program"
            fullWidth
            error={!!errors.program}
            helperText={errors.program?.message}
          />
          <TextField
            {...register("acct", { required: "Account Number is required" })}
            label="Account Number"
            fullWidth
            error={!!errors.acct}
            helperText={errors.acct?.message}
          />
          <TextField
            {...register("project", { required: "Project Name is required" })}
            label="Project Name"
            fullWidth
            error={!!errors.project}
            helperText={errors.project?.message}
          />
          <TextField
            {...register("hourlyRate", { required: "Hourly Rate is required" })}
            label="Hourly Rate"
            type="number"
            fullWidth
            error={!!errors.hourlyRate}
            helperText={errors.hourlyRate?.message}
          />
          <TextField
            {...register("payPeriodStartDate")}
            label="Pay Period Start Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            {...register("payPeriodEndDate")}
            label="Pay Period End Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <Controller
            name="assignmentType"
            control={control}
            defaultValue="Casual"
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel value="Auxiliary" control={<Radio />} label="Auxiliary" />
                <FormControlLabel value="Casual" control={<Radio />} label="Casual" />
              </RadioGroup>
            )}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Register Employee
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default SupervisorRegister;
