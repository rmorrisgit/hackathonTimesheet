import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import '../css/register.css';

const supervisorEmails = [
  'research1@nscc.ca',
  'research2@nscc.ca',
  'research3@nscc.ca',
  'research4@nscc.ca',
];

const Register = () => {
  const { register: registerUser } = useAuth(); // Renamed to avoid conflict with useForm's register
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [registerMessage, setRegisterMessage] = useState('');

  const onSubmit = async (data) => {
    // Determine the role
    const isSupervisor = supervisorEmails.includes(data.email);
    const payload = {
      ...data,
      role: isSupervisor ? 'supervisor' : 'employee',
    };

    const success = await registerUser(payload); // Use register from AuthContext
    if (success) {
      navigate('/'); // Redirect to homepage on success
    } else {
      setRegisterMessage('Registration failed. Please check your details and try again.');
    }
  };

  return (
    <form className="register-form-register mt-4 pt-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="register-form-title" style={{ marginTop: 120 }}>Create an Account</h1>

      {registerMessage && <div className="alert alert-danger">{registerMessage}</div>}

      <div className="register-form-group">
        <label htmlFor="firstName">First Name</label>
        <input
          {...register('firstName', { required: 'First Name is required' })}
          id="firstName"
          className={`register-form-control ${errors.firstName ? 'register-is-invalid' : ''}`}
          placeholder="Enter your first name"
        />
        {errors.firstName && <p className="register-error">{errors.firstName.message}</p>}
      </div>

      <div className="register-form-group">
        <label htmlFor="lastName">Last Name</label>
        <input
          {...register('lastName', { required: 'Last Name is required' })}
          id="lastName"
          className={`register-form-control ${errors.lastName ? 'register-is-invalid' : ''}`}
          placeholder="Enter your last name"
        />
        {errors.lastName && <p className="register-error">{errors.lastName.message}</p>}
      </div>

      <div className="register-form-group">
        <label htmlFor="email">Email</label>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email format' },
          })}
          id="email"
          className={`register-form-control ${errors.email ? 'register-is-invalid' : ''}`}
          placeholder="Enter your email"
        />
        {errors.email && <p className="register-error">{errors.email.message}</p>}
      </div>

      <div className="register-form-group">
        <label htmlFor="password">Password</label>
        <input
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters long' },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
              message: 'Password must include uppercase, lowercase, number, and special character',
            },
          })}
          type="password"
          id="password"
          className={`register-form-control ${errors.password ? 'register-is-invalid' : ''}`}
          placeholder="Enter your password"
        />
        {errors.password && <p className="register-error">{errors.password.message}</p>}
      </div>

      <button className="register-btn-submit" type="submit">
        Register
      </button>
    </form>
  );
};

export default Register;
