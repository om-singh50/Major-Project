const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const departmentRoutes = require('./routes/departments');

dotenv.config();
const app = express();
const server = http.createServer(app);

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',                         // local frontend
      'https://major-project-frontend-w233.onrender.com' // deployed frontend
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// ✅ Store io instance in app
app.set('io', io);

// ✅ Socket connection
io.on('connection', (socket) => {
  console.log('Socket.IO: A client connected');

  socket.on('disconnect', () => {
    console.log('Socket.IO: A client disconnected');
  });
});

// Connect to DB
connectDB();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://major-project-frontend-w233.onrender.com'
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/departments', departmentRoutes);

// Port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
