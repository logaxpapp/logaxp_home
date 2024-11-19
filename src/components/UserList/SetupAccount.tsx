import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSetupAccountMutation } from '../../api/usersApi';
import { useToast } from '../../features/Toast/ToastContext';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';

const SetupAccount: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [setupAccount, { isLoading }] = useSetupAccountMutation();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      showToast('Invalid setup link.', 'error');
      navigate('/login');
      return;
    }

    // Fetch user info to prefill the form
    fetch(`/api/auth/setup-account?token=${token}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Invalid or expired setup link.');
        }
        return response.json();
      })
      .then((data) => {
        setEmail(data.email);
        setName(data.name);
      })
      .catch(() => {
        showToast('Invalid or expired setup link.', 'error');
        navigate('/login');
      });
  }, [token, showToast, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showToast('Token is missing, please try again.', 'error');
      return;
    }

    try {
      await setupAccount({ token, password }).unwrap();
      showToast('Account setup successful! Please log in.', 'success');
      navigate('/login');
    } catch (error) {
      showToast('Failed to complete account setup. Please try again.', 'error');
    }
  };

  return (
    <div className="setup-account-form">
      <h2>Setup Your Account</h2>
      <p>Welcome, {name}. Please set a password to activate your account.</p>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={email}
          label="Email"
          disabled
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          required
        />
        <Button type="submit" isLoading={isLoading}>
          Complete Setup
        </Button>
      </form>
    </div>
  );
};

export default SetupAccount;
