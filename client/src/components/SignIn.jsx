// SignIn.jsx

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // Import useAuth for auth state management
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import '../css/form_control.css'; // Optional: Custom CSS for additional styling

const SignIn = () => {
  const { login } = useAuth(); // Destructure login from AuthContext
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [loginMessage, setLoginMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // For loading state

  // Function to handle form submission
  const receiveFormData = async (formData) => {
    setIsSubmitting(true); // Start loading
    const success = await login(formData); // Attempt to log in
    setIsSubmitting(false); // End loading

    if (success) {
      navigate('/'); // Redirect to the main page
    } else {
      console.log('Unsuccessful login');
      setLoginMessage('Incorrect Login');
    }
  };

  // Validation rules for email
  const emailValidationRules = {
    required: 'Email is required.',
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Please enter a valid email address.',
    },
    onChange: () => setLoginMessage(''), // Reset login message on change
  };

  // Validation rules for password
  const passwordValidationRules = {
    required: 'Password is required.',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters long.',
    },
    onChange: () => setLoginMessage(''), // Reset login message on change
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // backgroundColor: '#2D2D2C',
          paddingTop: '50px',
          paddingBottom: '50px',
          borderRadius: 2,
          boxShadow: 3,
          padding: 3,
          marginTop: '210px', // Adjusted for better responsiveness
        }}
      >
        <Typography variant="h4" gutterBottom align="center" color="black">
          Sign In
        </Typography>
        <form
          onSubmit={handleSubmit(receiveFormData)}
          style={{ width: '100%' }}
          autoComplete="off" // Disable autofill for the entire form
        >
          {/* Hidden Dummy Inputs to Trick Browsers for Autofill Prevention */}
          {/* Some browsers ignore autoComplete="off", so adding dummy fields can help */}
          <input
            type="text"
            name="fakeUsername"
            style={{ display: 'none' }}
            autoComplete="username"
          />
          <input
            type="password"
            name="fakePassword"
            style={{ display: 'none' }}
            autoComplete="new-password"
          />

          {/* Email Field */}
          <TextField
            {...register('email', emailValidationRules)}
            id="inputEmail"
            label="Email Address"
            variant="outlined"
            fullWidth
            autoFocus
            autoComplete="off" // Further prevent autofill
            sx={{
              marginBottom: 2,
              background: 'white',
              borderRadius: 1,
            }}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {/* Password Field */}
          <TextField
            {...register('password', passwordValidationRules)}
            type="password"
            id="inputPassword"
            label="Password"
            variant="outlined"
            fullWidth
            autoComplete="new-password" // Prevent autofill
            sx={{
              marginBottom: 2,
              background: 'white',
              borderRadius: 1,
            }}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting} // Disable button while submitting
            sx={{
              mt: 1,
              mb: 2,
              backgroundColor: '#1a73e8',
              color: 'black', // **Added to make text black**
              '&:hover': {
                backgroundColor: '#0f59b5',
                color: 'black', // **Ensure text remains black on hover**
              },
              height: '45px',
            }}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* Error Alert */}
          {loginMessage && (
            <Alert severity="error" sx={{ marginTop: 2 }}>
              {loginMessage}
            </Alert>
          )}
        </form>
      </Box>
    </Container>
  );
};

export default SignIn;
