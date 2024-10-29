import React, { useState } from 'react';
import { useLoginMutation } from '../../api/apiSlice';
import { useAppDispatch } from '../../hooks/hooks';
import { setUserInfo } from '../../store/slices/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Eye icons for password visibility toggle
import Logo from '../../assets/images/logo.png';
import DarkModeToggle from '../../components/DarkModeToggle'; // Ensure your DarkModeToggle component is imported
import IllustrationImage from '../../assets/images/Frame.png';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string; }>({});
  const [rememberMe, setRememberMe] = useState(false); // Remember Me state
  const [showPassword, setShowPassword] = useState(false); // Password visibility state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [e.target.name]: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await login(credentials).unwrap();
      dispatch(setUserInfo(userData));
      if (rememberMe) {
        // Store token if "Remember Me" is checked
        localStorage.setItem('token', userData.token);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to login:', err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="min-h-screen flex dark:bg-gray-800 transition-colors duration-300">
      {/* Left Column (Illustration and Marketing Text) */}
      <div className="hidden lg:flex w-1/2 bg-lemonGreen-light items-center justify-center p-10 text-white">
        <div className="flex flex-col items-center text-center">
          <img src={IllustrationImage} alt="Illustration" className="mb-6 w-3/4" />
          <h2 className="text-[28px] font-bold leading-[52px] tracking-tight text-center text-black">
            Connect with every LogaXP application
          </h2>

          <p className="text-gray-800">Everything you need in an easily accessible dashboard.</p>
        </div>
      </div>

      {/* Right Column (Login Form) */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 p-8 bg-white dark:bg-gray-900 transition-colors duration-300 relative">
        {/* Logo at the Top-Left */}
        <div className="absolute top-6 left-6 flex items-center">
          <Link to="/" className="inline-flex items-center">
            <img src={Logo} alt="LogaXP Logo" className="h-10" />
            <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">LogaXP</span>
          </Link>
        </div>

        {/* Dark Mode Toggle at the Top-Right */}
        <div className="absolute top-6 right-6" >
          <DarkModeToggle />
        </div>

        <div className="mx-auto w-full max-w-md mt-16">
          <h2 className="text-[48px] text-gray-800 font-semibold dark:text-white "> Login</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-8">Login to you account with your email and password</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <label htmlFor="email" className="block text-black text-sm dark:text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-lemonGreen"
                placeholder="logaxp@example.com"
              />
              {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
            </div>

            {/* Password Input with Eye Icon */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm   text-black dark:text-gray-300 mb-1">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded focus:outline-none focus:ring bg-gray-50 focus:ring-lemonGreen"
                placeholder="••••••••"
              />
              {/* Toggle Password Visibility */}
              <span
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-gray-400 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe((prev) => !prev)}
                  className="form-checkbox h-4 w-4 text-lemonGreen dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Remember Me</span>
              </label>
              <Link to="/password-reset" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 text-sm">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-lemonGreen-light hover:bg-green-600 text-gray-900 font-semibold py-3 rounded transition-colors"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            {/* Error Message */}
            {error && <p className="text-red-500 text-center mt-2">Failed to login. Please try again.</p>}
          </form>

          <div className="mt-4 flex items-center ml-16">
            <span className="text-sm text-gray-600"> Don't have an account? </span>
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
