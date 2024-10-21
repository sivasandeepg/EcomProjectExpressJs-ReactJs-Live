import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupVendor } from '../../services/vendor/AuthServices';
import '../../styles/Login.css';
 
const AdminSignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for better UX
  const navigate = useNavigate();

  // Helper function to validate email format
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Helper function to generate a random business license or google ID
  const generateRandomId = () => `ID-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Form submit handler
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state

    // Basic form validation
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (!storeName) {
      setError('Store Name is required.');
      setLoading(false);
      return;
    }
 
    // Generate random IDs if fields are empty
    const license = generateRandomId();
    const googleId = generateRandomId();   

    try {
      const data = await signupVendor({
        email,
        password,
        storeName,
        businessLicense: license,
        displayName: storeName,
        googleId,
      });
      if(data){
      // On success, show success message and reset form
      setSuccess('Signup successful! Redirecting to dashboard...');
      }

      setError(null);

      // Clear form fields
      setEmail('');
      setPassword('');
      setStoreName('');

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/vendor/dashboard');
      }, 2000);
    } catch (err) {
      // Error handling
      setError(err.response ? err.response.data.message : 'An error occurred. Please try again.');
      setSuccess(null);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="formGroup">
            <label>Vendor Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="formGroup">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="formGroup">
            <label>Store Name:</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <button type="submit" className="loginButton" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        {/* Link to sign-in page */}
        <p className="signupRedirect">
          Already have an account? <Link to="/vendor/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};
 
export default AdminSignupForm;
 