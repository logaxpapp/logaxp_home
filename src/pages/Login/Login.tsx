// src/pages/Login.tsx

import React, { useState } from 'react';
import { useLoginMutation } from '../../api/usersApi';
import { useAppDispatch } from '../../app/hooks';
import { setAuthCredentials } from '../../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../../assets/images/sec.png';
import DarkModeToggle from '../../components/DarkModeToggle';
import IllustrationImage from '../../assets/images/Frame.png';
import Button from '../../components/common/Button/Button';
import TextInput from '../../components/common/Input/TextInput';
import Checkbox from '../../components/common/Input/Checkbox';
import Form from '../../components/common/Form/Form';
import {PasswordInput} from '../../components/common/Input/PasswordInput';
import { useToast } from '../../features/Toast/ToastContext';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { showToast } = useToast();

  const [credentials, setCredentialsState] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentialsState(prev => ({
      ...prev,
      [e.target.name]: e.target.value, 
    }));
    setFormErrors(prev => ({
      ...prev,
      [e.target.name]: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await login(credentials).unwrap();
      dispatch(setAuthCredentials({ user: userData.user }));
  
      // Store user data if remember me is selected
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(userData.user));
      }
  
      showToast('Logged in successfully!', 'success');
  
      // Check for password expiry notice
      if (userData.user.passwordExpiryNotice) {
        showToast(userData.user.passwordExpiryNotice, 'info');
      }
  
      navigate('/dashboard'); // Navigate to dashboard
    } catch (err: any) {
      const status = err?.status;
      const errorMessage = err?.data?.message || 'Failed to login. Please check your credentials.';
  
      if (status === 403) {
        // Password has expired
        showToast(errorMessage, 'error');
        // Redirect to change password page
        navigate('/change-password'); // Or display a modal/prompt
      } else {
        // Other errors
        showToast(errorMessage, 'error');
      }
      console.error('Failed to login:', err);
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div className="min-h-screen flex dark:bg-gray-800 transition-colors duration-300">
      {/* Left Column (Illustration and Marketing Text) */}
      <div className="hidden lg:flex w-1/2 bg-lemonGreen-light items-center justify-center p-10 text-white">
        <div className="flex flex-col items-center text-center">
          <img src={IllustrationImage} alt="Illustration" className="mb-6 w-3/4" />
          <h2 
            className="text-[28px] font-bold leading-[52px] tracking-tight text-center text-black" 
            style={{ fontFamily: 'Plus Jakarta Sans' }}
          >
            Connect with every LogaXP application
          </h2>
          <p className="text-gray-800">Everything you need in an easily accessible dashboard.</p>
        </div>
      </div>

      {/* Right Column (Login Form) */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 p-8 bg-white dark:bg-gray-900 transition-colors duration-300 relative"  style={{ fontFamily: 'Plus Jakarta Sans' }}> 
        {/* Logo at the Top-Left */}
        <div className="absolute top-6 left-6 flex items-center">
          <Link to="/" className="inline-flex items-center font-bold text-2xl text-black dark:text-gray-100">
            <img src={Logo} alt="LogaXP Logo" className="h-6" />
           
          </Link>
        </div>

        {/* Dark Mode Toggle at the Top-Right */}
        <div className="absolute top-6 right-6">
          <DarkModeToggle />
        </div>

        <div className="mx-auto w-full max-w-md mt-16">
          <h2 className="text-[48px] text-gray-800 font-semibold dark:text-white font-primary">Login</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-8" style={{ fontFamily: 'Plus Jakarta Sans' }}>Login to your account with your email and password</p>

          <Form onSubmit={handleSubmit}>
            {/* Email Input */}
            <TextInput
              label="Email Address"
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleChange}
              required
              error={formErrors.email}
              placeholder=""
            />

            {/* Password Input with Eye Icon */}
            <PasswordInput
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={handleChange}
              required
              error={formErrors.password}
              placeholder=""
              toggleVisibility={togglePasswordVisibility}
              showPassword={showPassword}
            />

            {/* Remember Me */}
            <div className="flex items-center justify-between mb-6">
              <Checkbox
                label="Remember Me"
                checked={rememberMe}
                onChange={() => setRememberMe(prev => !prev)}
              />
              <Link to="/password-reset" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 text-sm">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="large"
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </Form>

          <div className="mt-4 flex items-center ml-16">
            <span className="text-sm text-gray-600">Don't have an account?</span>
            <Link to="/register" className="text-sm text-lemonGreen-light hover:text-green-700 ml-1">
              <span className="font-bold underline">Create an Account</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
