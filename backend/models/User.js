const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {                      // Full name
    type: String,
    required: true,
  },
  email: {                     // Unique email
    type: String,
    required: true,
    unique: true,
  },
  password: {                  // Hashed password
    type: String,
    required: true,
  },
  role: {                      // Admin or HOD
    type: String,
    enum: ['Admin', 'HOD'],
    required: true,
  },
  department: {                // Only for HOD
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('User', userSchema);
