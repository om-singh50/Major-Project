const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessagesByDepartment,
  getAllMessages,
  updateMessage,
  deleteMessage
} = require('../controllers/messageController');

// Route to get all messages (for Admin)
router.get('/', getAllMessages);

// Route to get messages by department (for HOD)
router.get('/department/:department', getMessagesByDepartment);

// Create a new message
router.post('/', createMessage);

// Update a message
router.put('/:id', updateMessage);

// Delete a message
router.delete('/:id', deleteMessage);

module.exports = router;
