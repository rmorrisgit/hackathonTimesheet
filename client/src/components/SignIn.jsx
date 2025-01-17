import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // Import useAuth for auth state management
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import '../css/form_control.css';

const SignIn = () => {
  const { login } = useAuth(); // Destructure login from AuthContext
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const [loginMessage, setLoginMessage] = useState('');

  async function receiveFormData(formData) {
    const success = await login(formData); // Use the updated login function
    if (success) {
      // navigate("/"); 

      window.location.href = "/"; // Redirect to the main page with a hard refresh
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
        <label htmlFor="inputEmail" className="sr-only">Email address</label>

        {/* <TextField id="outlined-basic" label="Email" variant="outlined" sx={{ marginBottom: 2 , width: '100%', background: 'white'}}> */}
            <input {...register('email', {required: "Email is required."})} id="inputEmail" className="form-control" placeholder="Email address" autoFocus />
        {/* </TextField> */}
            {errors.email?.type === 'required' && <p role="alert" style={{color:'red'}}>Email is required</p>}

        {/* <TextField id="outlined-basic" label="Password" variant="outlined" sx={{width: '100%', background: 'white'}}> */}
            <label htmlFor="inputPassword" className="sr-only">Password</label>
            <input {...register('password', {required: "Password is required"})} type="password" id="inputPassword" className="form-control" placeholder="Password" />
        {/* </TextField> */}
            {errors.password?.type === 'required' && <p role="alert" style={{color:'red'}}>Password is required</p>}

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
