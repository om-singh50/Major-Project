import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HodDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const department = localStorage.getItem('department');
  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`https://major-project-backend-okz9.onrender.com/api/messages/department/${department}`);
      setMessages(res.data);
    } catch (err) {
      toast.error('Failed to fetch messages');
    }
  };

  const handleCreate = async () => {
    if (!newMessage.trim()) return toast.error('Message cannot be empty!');
    try {
      await axios.post('https://major-project-backend-okz9.onrender.com/api/messages', {
        content: newMessage,
        department,
      });
      setNewMessage('');
      toast.success('Message posted!');
      fetchMessages();
    } catch (err) {
      toast.error('Failed to post message');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://major-project-backend-okz9.onrender.com/api/messages/${id}`);
      toast.success('Message deleted!');
      fetchMessages();
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  const handleEdit = async (id) => {
    if (!editContent.trim()) return toast.error('Edited message cannot be empty!');
    try {
      await axios.put(`https://major-project-backend-okz9.onrender.com/api/messages/${id}`, {
        content: editContent,
      });
      setEditId(null);
      setEditContent('');
      toast.success('Message updated!');
      fetchMessages();
    } catch (err) {
      toast.error('Failed to update message');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const filteredMessages = messages.filter((msg) =>
    msg.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <>
     
      <motion.div
        className="p-6 max-w-5xl mx-auto min-h-screen"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ToastContainer />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#006A71]">HOD Dashboard - {department}</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Type a new message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border p-2 rounded-md"
          />
          <button
            onClick={handleCreate}
            className="bg-[#006A71] text-white px-4 py-2 rounded-md hover:bg-[#048C95] transition"
          >
            Post
          </button>
        </div>

        <input
          type="text"
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6 w-full border p-2 rounded-md"
        />

        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <p className="text-center text-gray-600">No messages found.</p>
          ) : (
            filteredMessages.map((msg) => (
              <motion.div
                key={msg._id}
                className="border p-4 rounded-lg shadow-sm bg-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-1">
                      Department: <span className="text-[#006A71]">{msg.department}</span>
                    </p>
                    {editId === msg._id ? (
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 mb-2"
                      />
                    ) : (
                      <p className="text-gray-700">{msg.content}</p>
                    )}
                  </div>
                  <div className="ml-4 space-x-2">
                    {editId === msg._id ? (
                      <>
                        <button
                          onClick={() => handleEdit(msg._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditId(null);
                            setEditContent('');
                          }}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditId(msg._id);
                            setEditContent(msg.content);
                          }}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(msg._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
      
    </>
  );
};

export default HodDashboard;
