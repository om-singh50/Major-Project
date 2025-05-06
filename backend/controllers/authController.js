const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password, role, department } = req.body; // Adjusted to match frontend form data

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      name,  // Adjusted from username to name
      email, // Added email field
      password: hashedPassword,
      role,
      department: role === 'HOD' ? department : '',
    });

    // Save the new user to the database
    await newUser.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body; // Using email instead of username

  try {
    const user = await User.findOne({ email }); // Adjusted to find by email
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role, department: user.department },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};
