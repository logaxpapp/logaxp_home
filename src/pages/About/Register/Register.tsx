import React, { useState } from 'react';
import { Form } from '../../../components/common/Form';
import TextInput from '../../../components/common/Input/TextInput';
import Button from '../../../components/common/Button';
import { useRegisterUserMutation } from '../../../api/usersApi';
import { PasswordInput } from '../../../components/common/Input/PasswordInput';

const Register: React.FC = () => {
  const [register, { isLoading, error }] = useRegisterUserMutation();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFormErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev); // Toggle the password visibility
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData).unwrap();
      // Handle successful registration
    } catch (err) {
      // Handle registration errors
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Register</h2>
        <TextInput
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          error={formErrors.name}
          placeholder="John Doe"
        />
        <TextInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          error={formErrors.email}
          placeholder="johndoe@example.com"
        />
        <PasswordInput
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'} // Dynamically set type
          value={formData.password}
          onChange={handleChange}
          required
          error={formErrors.password}
          placeholder="••••••••"
          toggleVisibility={togglePasswordVisibility} // Pass toggle function
          showPassword={showPassword} // Pass current state of visibility
        />
        <Button type="submit" variant="primary" size="large" isLoading={isLoading} disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
        {error && <p className="text-red-500 text-sm mt-2">Registration failed. Please try again.</p>}
      </Form>
    </div>
  );
};

export default Register;
