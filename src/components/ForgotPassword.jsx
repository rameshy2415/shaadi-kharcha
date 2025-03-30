import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }
    
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response =  await authAPI.forgetPassword({ email });

      console.log('response', response)
      setMessage({ 
        type: 'success', 
        text: 'Password reset email sent! Please check your inbox.' 
      });
      setEmail('');

      /* if (response.status == 200) {
        setMessage({ 
          type: 'success', 
          text: 'Password reset email sent! Please check your inbox.' 
        });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to send reset email' });
      } */
    } catch (error) {
      setMessage({ type: 'error', text: 'Server error. Please try again later.' });
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-pink-500 mb-1">
              Forgot Password
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Enter your email and we'll send you a link to reset your password
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white cursor-pointer ${
                  isSubmitting 
                    ? 'bg-pink-300 cursor-not-allowed' 
                    : 'bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Email...
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>
            
            <div className="text-sm text-center">
              <Link to="/login" className="font-medium text-pink-500 hover:text-pink-600">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 sm:px-10">
          <p className="text-xs text-gray-700">
            Remember your password? <Link to="/login" className="font-medium text-pink-500 hover:text-pink-600">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;