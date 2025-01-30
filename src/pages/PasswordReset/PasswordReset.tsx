import React, { useState, useRef, useEffect } from 'react';
import { usePasswordResetMutation } from '../../api/usersApi';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import IllustrationImage from '../../assets/images/Frame.png';

// Animation Variants
const formContainerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
};

const inputVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const successVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// ErrorMessage Component
interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <motion.p
    className="text-red-500 text-sm mt-1"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3, delay: 0.7 }}
    aria-live="polite"
  >
    {message}
  </motion.p>
);

// SuccessMessage Component
interface SuccessMessageProps {
  email: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ email }) => {
  const successRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (successRef.current) {
      successRef.current.focus();
    }
  }, []);

  return (
    <motion.div
      ref={successRef}
      tabIndex={-1}
      className="text-center space-y-4"
      variants={successVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
      aria-live="polite"
    >
      <p className="text-green-600 font-medium text-lg">
        Password reset email sent successfully!
      </p>
      <p className="text-gray-600">
        A password reset link has been sent to your email: <strong>{email}</strong>.
      </p>
      <Link
        to="/login"
        className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition duration-200"
      >
        <FaArrowLeft className="mr-2" /> Back to Login
      </Link>
    </motion.div>
  );
};

// ResetForm Component
interface ResetFormProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  formError: string | null;
  handleSubmit: (e: React.FormEvent) => void;
}

const ResetForm: React.FC<ResetFormProps> = ({ email, setEmail, formError, handleSubmit }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <form onSubmit={handleSubmit} noValidate>
      <motion.div
        className="relative mb-6"
        variants={prefersReducedMotion ? {} : inputVariants}
        initial={prefersReducedMotion ? undefined : "hidden"}
        animate={prefersReducedMotion ? undefined : "visible"}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <label htmlFor="email" className="block text-gray-700 mb-2">
          Email Address
        </label>
        <motion.div
          className="relative"
          variants={prefersReducedMotion ? {} : inputVariants}
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate={prefersReducedMotion ? undefined : "visible"}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <motion.input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full px-4 py-3 pl-12 border ${
              formError ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm`}
            placeholder="you@example.com"
            variants={prefersReducedMotion ? {} : inputVariants}
            initial={prefersReducedMotion ? undefined : "hidden"}
            animate={prefersReducedMotion ? undefined : "visible"}
            transition={{ duration: 0.3, delay: 0.5 }}
          />
          <motion.div
            className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400"
            variants={prefersReducedMotion ? {} : inputVariants}
            initial={prefersReducedMotion ? undefined : "hidden"}
            animate={prefersReducedMotion ? undefined : "visible"}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <FaEnvelope />
          </motion.div>
        </motion.div>
        {formError && <ErrorMessage message={formError} />}
      </motion.div>

      <motion.button
        type="submit"
        disabled={false}
        className="w-full py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-indigo-400"
        variants={prefersReducedMotion ? {} : buttonVariants}
        whileHover={prefersReducedMotion ? undefined : "hover"}
        whileTap={prefersReducedMotion ? undefined : "tap"}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        Send Reset Email
      </motion.button>
    </form>
  );
};

// PasswordReset Component
const PasswordReset: React.FC = () => {
  const [passwordReset, { isLoading, error, isSuccess }] = usePasswordResetMutation();
  const csrfToken = useSelector((state: RootState) => state.csrf.csrfToken);

  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setFormError('Please enter your email address.');
      return;
    }

    if (!csrfToken) {
      setFormError('Failed to fetch CSRF token. Please refresh the page.');
      return;
    }

    const validateEmail = (email: string) => {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    };

    if (!validateEmail(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    try {
      await passwordReset({ email }).unwrap();
      setFormError(null);
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to send password reset email.';
      setFormError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex dark:bg-gray-800 transition-colors duration-300">
      {/* Illustration (Hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 bg-lemonGreen-light items-center justify-center p-10 text-white">
        <div className="flex flex-col items-center text-center">
          <img src={IllustrationImage} alt="Illustration" className="mb-6 w-3/4" />
          <h2
            className="text-[28px] font-bold leading-[52px] tracking-tight text-center text-black"
            style={{ fontFamily: 'Plus Jakarta Sans' }}
          >
            Connect with every LogaXP application
          </h2>
          <p className="text-gray-800">
            Everything you need in an easily accessible dashboard.
          </p>
        </div>
      </div>
      {/* Form Container */}
      <div  className="flex flex-col justify-center w-full lg:w-1/2 p-8 bg-white dark:bg-gray-900 transition-colors duration-300 relative"
        style={{ fontFamily: 'Plus Jakarta Sans' }}
      >
        <AnimatePresence>
          {isSuccess ? (
            <motion.div
              key="success"
              className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md mx-auto space-y-6"
              variants={formContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <SuccessMessage email={email} />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md mx-auto space-y-6"
              variants={formContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <motion.h2
                className="text-3xl font-bold text-gray-800 text-center mb-4"
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Reset Your Password
              </motion.h2>
              <motion.p
                className="text-center text-gray-600 mb-8"
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Enter your email, and we'll send you instructions to reset your password.
              </motion.p>

              <ResetForm
                email={email}
                setEmail={setEmail}
                formError={formError}
                handleSubmit={handleSubmit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PasswordReset;