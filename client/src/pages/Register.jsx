import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    department: '',
  });

  const departments = ['CSE', 'ECE', 'ME', 'CE', 'EE', 'EEE', 'IT'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, role, department } = formData;

    if (!name || !email || !password || !role || (role === 'HOD' && !department)) {
      toast.error('Please fill all required fields.');
      return;
    }

    try {
      const res = await axios.post('https://major-project-backend-okz9.onrender.com/api/auth/register', formData);
      toast.success('Registration successful! Redirecting...');

      setTimeout(() => {
        if (role === 'Admin') navigate('/admin-dashboard');
        else navigate('/hod-dashboard');
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Registration failed');
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
      <h2 className="text-2xl font-semibold text-center text-[#006A71] mb-6">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
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
        {formData.role === 'HOD' && (
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        )}
        <button
          type="submit"
          className="w-full bg-[#006A71] text-white font-semibold py-2 rounded-md hover:bg-[#048C95] transition-colors duration-300"
        >
          Register
        </button>
        <p className="text-center text-sm mt-2">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/')}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Login here
          </span>
        </p>
      </form>
    </motion.div>
  );
};

export default Register;
