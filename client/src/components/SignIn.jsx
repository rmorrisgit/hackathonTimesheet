import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // Import useAuth for auth state management
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';

const SignIn = () => {
  const { login } = useAuth(); // Destructure login from AuthContext
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const [loginMessage, setLoginMessage] = useState('');

  async function receiveFormData(formData) {
    const success = await login(formData); // Use the updated login function
    if (success) {
      navigate('/');
    } else {
      console.log('Unsuccessful login');
      setLoginMessage('Incorrect Login');
    }
  }

  const emailValidationRules = {
    required: "Email is required",
    pattern: {
      value: /\S+@\S+\.\S+/,
      message: "Entered value does not match email format",
    },
    onChange: () => setLoginMessage(''),
  };
  const passwordValidationRules = {
    required: "Password is required",
    onChange: () => setLoginMessage(''),
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#2D2D2C',
          paddingTop: '50px',
          paddingBottom: '50px',
          borderRadius: 2,
          boxShadow: 3,
          padding: 3,
          marginTop: '200px'
        }}
      >
        <Typography variant="h4" gutterBottom align="center" color="white">
          Sign in
        </Typography>
        <form onSubmit={handleSubmit(receiveFormData)} style={{ width: '100%' }}>
          <TextField
            fullWidth
            margin="normal"
            label="Email address"
            {...register('email', emailValidationRules)}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            onChange={() => setLoginMessage('')}
            variant="outlined"
            InputLabelProps={{
              style: { color: 'white' }
            }}
            InputProps={{
              style: { color: 'white' }
            }}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)', // Light border color
                },
                '&:hover fieldset': {
                  borderColor: '#1a73e8', // Highlight border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1a73e8', // Border color when focused
                },
              },
            }}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            {...register('password', passwordValidationRules)}
            type="password"
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            onChange={() => setLoginMessage('')}
            variant="outlined"
            InputLabelProps={{
              style: { color: 'white' }
            }}
            InputProps={{
              style: { color: 'white' }
            }}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)', // Light border color
                },
                '&:hover fieldset': {
                  borderColor: '#1a73e8', // Highlight border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1a73e8', // Border color when focused
                },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: '#1a73e8',
              '&:hover': {
                backgroundColor: '#0f59b5',
              },
            }}
          >
            Sign in
          </Button>

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
