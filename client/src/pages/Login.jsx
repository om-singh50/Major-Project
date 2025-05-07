import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, role } = formData;

    if (!email || !password || !role) {
      toast.error('Please fill all fields!');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      const user = res.data.user;

      // Save details in localStorage
      localStorage.setItem('role', user.role);
      localStorage.setItem('email', user.email);

      if (user.role === 'HOD') {
        localStorage.setItem('department', user.department); // ✅ store department
      }

      toast.success('Login successful! Redirecting...');
      setTimeout(() => {
        if (role === 'Admin') navigate('/admin-dashboard');
        else navigate('/hod-dashboard');
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <motion.div
      className="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ToastContainer />
      <h2 className="text-2xl font-semibold text-center text-[#006A71] mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 pr-10"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-sm cursor-pointer text-gray-600 hover:text-black"
          >
            {showPassword ? 'Hide' : 'Show'}
          </span>
        </div>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="HOD">HOD</option>
        </select>
        <button
          type="submit"
          className="w-full bg-[#006A71] text-white font-semibold py-2 rounded-md hover:bg-[#048C95] transition-colors duration-300"
        >
          Login
        </button>
        <p className="text-center text-sm mt-2">
          New user?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Register here
          </span>
        </p>
      </form>
    </motion.div>
  );
};

export default Login;
