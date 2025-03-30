import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { authAPI } from "../services/api";

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [tokenValid, setTokenValid] = useState(true);
  const { resetToken } = useParams();
  const navigate = useNavigate();

  // Password validation states
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');

  useEffect(() => {
    // You can optionally validate the token first by making an API call
    // For now, we'll assume it's valid if it exists
    if (!resetToken) {
      setTokenValid(false);
      setMessage({ 
        type: 'error', 
        text: 'Invalid password reset link. Please request a new one.' 
      });
    }
  }, [resetToken]);

  useEffect(() => {
    // Simple password strength checker
    if (!password) {
      setPasswordStrength(0);
      setPasswordFeedback('');
      return;
    }

    let strength = 0;
    // Add points for length
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Add points for complexity
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
    
    // Set feedback based on strength
    if (strength <= 1) {
      setPasswordFeedback('Weak - Try adding numbers and special characters');
    } else if (strength <= 3) {
      setPasswordFeedback('Medium - Getting better!');
    } else {
      setPasswordFeedback('Strong - Great password!');
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (!password || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please enter both password fields' });
      return;
    }
    
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }
    
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      await authAPI.resetPassword(resetToken, { password });
      
      setMessage({ 
        type: 'success', 
        text: 'Password successfully reset! You will be redirected to the login page.' 
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
      /* if (response.status == 200) {
        setMessage({ 
          type: 'success', 
          text: 'Password successfully reset! You will be redirected to the login page.' 
        });
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to reset password' });
      } */
    } catch (error) {
      setMessage({ type: 'error', text: 'Server error. Please try again later.' });
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get strength color
  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Render invalid token message
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">This password reset link is invalid or has expired. Please request a new one.</p>
          <Link 
            to="/forgot-password" 
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
              Reset Your Password
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Enter your new password below
            </p>
          </div>
          
          {message.text && (
            <div 
              className={`mb-4 p-3 rounded ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
              </div>
              
              {password && (
                <div className="mt-2">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs mt-1 ${
                    passwordStrength <= 1 ? 'text-red-500' : 
                    passwordStrength <= 3 ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {passwordFeedback}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitting 
                    ? 'bg-pink-300 cursor-not-allowed' 
                    : 'bg-pink-500 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-600'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting Password...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 sm:px-10">
          <p className="text-xs text-center text-gray-500">
            Remember your password? <Link to="/login" className="font-medium text-pink-600 hover:text-pink-500">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;