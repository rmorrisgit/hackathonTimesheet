import { useState } from 'react';
import '../css/signin.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // Import useAuth for auth state management

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
    <>
      <div
        className="album"
        style={{
          padding: '0',
          backgroundColor: '#2D2D2C',
          paddingTop: '50px',
          paddingBottom: '50px',
        }}
      >
        <div
          className="container bg-dark"
          style={{
            height: '600px',
            alignContent: 'center',
          }}
        >
          <form
            className="form-signin bg-light p-3"
            style={{
              height: '350px',
              alignContent: 'center',
              border: '2px solid black',
            }}
            onSubmit={handleSubmit(receiveFormData)}
          >
            <h1 className="h3 mb-3 font-weight-normal text-center pb-4">Sign in</h1>
            <label htmlFor="inputEmail" className="sr-only">
              Email address
            </label>
            <input
              onChange={() => setLoginMessage('')}
              {...register('email', emailValidationRules)}
              id="inputEmail"
              className="form-control"
              placeholder="Email address"
            />
            {errors.email && <span className="text-danger">{errors.email.message}</span>}
            <label htmlFor="inputPassword" className="sr-only">
              Password
            </label>
            <input
              onChange={() => setLoginMessage('')}
              {...register('password', passwordValidationRules)}
              type="password"
              id="inputPassword"
              className="form-control mt-2"
              placeholder="Password"
            />
            {errors.password && <span className="text-danger">{errors.password.message}</span>}

            <button className="btn btn-lg btn-dark btn-block" type="submit">
              Sign in
            </button>

            <div>{loginMessage}</div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
