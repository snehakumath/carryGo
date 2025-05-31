import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    user_type: 'customer',
    // user_id: '',
    phone:'',
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Post data to the backend
      const response = await axios.post('http://localhost:8000/signup', formData);
      if (response.data.success) {
        alert('Signup successful!');
        navigate('/'); // Redirect to home page
      } else {
        setError(response.data.message || 'Signup failed.');
      }
    } catch (err) {
        console.log(err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
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
        <h2 className="text-3xl font-bold text-white text-center">Sign Up</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300">I am a:</label>
            <div className="flex space-x-4 mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="user_type"
                  value="customer"
                  checked={formData.user_type === 'customer'}
                  onChange={handleChange}
                  className="text-blue-500"
                />
                <span className="text-gray-200">Customer</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="user_type"
                  value="transporter"
                  checked={formData.user_type === 'transporter'}
                  onChange={handleChange}
                  className="text-blue-500"
                />
                <span className="text-gray-200">Transporter</span>
              </label>
            </div>
          </div>
     
      {/*aadahr number */}
         {/*  <div>
            <label className="block text-sm font-medium text-gray-300">Aadhar No.</label>
            <input
              type="text"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              placeholder="Enter Aadhar number"
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          */}
          
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
         
         {/*phone number */}
         <div>
            <label className="block text-sm font-medium text-gray-300">Phone No.</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter Phone number"
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Sign Up
            </button>
          </div>

          {/* Login Redirect */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <a href="/login" className="text-blue-400 hover:underline">
                Log In
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

