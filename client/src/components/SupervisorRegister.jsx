import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import '../css/register.css';

const SupervisorRegister = () => {
  const { register: registerEmployee } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [registerMessage, setRegisterMessage] = useState('');

  const onSubmit = async (data) => {
    const payload = { ...data, role: 'employee' };
    const success = await registerEmployee(payload);
    if (success) {
      navigate('/employees'); // Redirect to employee management page
    } else {
      setRegisterMessage('Failed to register employee. Please try again.');
    }
  };

  return (
    <form className="register-form-register mt-4 pt-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="register-form-title" style={{ marginTop: 120 }}>Register Employee</h1>

      {registerMessage && <div className="alert alert-danger">{registerMessage}</div>}

      <div className="register-form-group">
        <label htmlFor="firstName">First Name</label>
        <input
          {...register('firstName', { required: 'First Name is required' })}
          id="firstName"
          className={`register-form-control ${errors.firstName ? 'register-is-invalid' : ''}`}
          placeholder="Enter employee's first name"
        />
        {errors.firstName && <p className="register-error">{errors.firstName.message}</p>}
      </div>

      <div className="register-form-group">
        <label htmlFor="lastName">Last Name</label>
        <input
          {...register('lastName', { required: 'Last Name is required' })}
          id="lastName"
          className={`register-form-control ${errors.lastName ? 'register-is-invalid' : ''}`}
          placeholder="Enter employee's last name"
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
          placeholder="Enter employee's email"
        />
        {errors.email && <p className="register-error">{errors.email.message}</p>}
      </div>

      <button className="register-btn-submit" type="submit">
        Register Employee
      </button>
    </form>
  );
};

export default SupervisorRegister;
