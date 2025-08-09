

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user_type, setUserType] = useState('customer'); 
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

     try {
    //   const response = await fetch('http://localhost:8000/login', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ email, password, user_type }),
    //   });
    const response = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 🔥 This is required to store cookies!
      body: JSON.stringify({ email, password, user_type }),
    });
    
      const data = await response.json();
      if (response.ok) {
        console.log('Login successful:', data);

        if (typeof window !== 'undefined') {
          //localStorage.setItem('token', data.accessToken); // Ensure correct key
          console.log("Type of window ", typeof window);
        }
        if (data.user_type === 'customer') {
          navigate('/', { replace: true });
        } else if (data.user_type === 'transporter') {
          navigate('/owner', { replace: true });
        }
      } else {
        setErrorMessage(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://corlettexpress.com/wp-content/uploads/2020/09/AdobeStock_244807532-2048x1024.jpeg')",
      }}
    >
      <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center">Login</h2>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Login as:</label>
            <div className="flex space-x-4 mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="user_type"
                  value="customer"
                  checked={user_type === 'customer'}
                  onChange={(e) => setUserType(e.target.value)}
                  className="text-blue-500"
                  required
                />
                <span className="text-gray-200">Customer</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="user_type"
                  value="transporter"
                  checked={user_type === 'transporter'}
                  onChange={(e) => setUserType(e.target.value)}
                  className="text-blue-500"
                  required
                />
                <span className="text-gray-200">Transporter</span>
              </label>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className={`w-full ${loading ? 'bg-gray-500' : 'bg-blue-500'} text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          {/* Signup Redirect */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              Don’t have an account?{' '}
              <a href="/signup" className="text-blue-400 hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
