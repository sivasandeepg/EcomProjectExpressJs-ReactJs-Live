import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/VendorAuthContext';
import '../../styles/Login.css';

const AdminLoginForm = () => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!isValidEmail(email)) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setLocalError('Password is required.');
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      setLocalError(error.message || 'Login failed.');
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <h2>Vendor Login</h2>
        <form onSubmit={handleLogin}>
          <div className="formGroup">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="formGroup">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {(localError || error) && <p className="error">{localError || error}</p>}
          <button type="submit" className="loginButton" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="signupRedirect">
          Don't have an account? <Link to="/vendor/registration">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginForm;
 