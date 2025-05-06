const Message = require('../models/Message');

// Create a new message
exports.createMessage = async (req, res) => {
  const { content, department } = req.body;

  try {
    const newMessage = new Message({ content, department });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create message' });
  }
};

// Get all messages (for Admin)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Get messages by department (for HOD)
exports.getMessagesByDepartment = async (req, res) => {
  try {
    const messages = await Message.find({ department: req.params.department }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Update a message
exports.updateMessage = async (req, res) => {
  try {
    const updated = await Message.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};
