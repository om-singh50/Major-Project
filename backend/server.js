const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const departmentRoutes = require('./routes/departments');


dotenv.config();
const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // frontend port
    credentials: true,
}));
  
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/departments', departmentRoutes);


// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
