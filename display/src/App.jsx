import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://major-project-backend-okz9.onrender.com'); // Change if needed

const App = () => {
  const [department, setDepartment] = useState('CSE');
  const [messages, setMessages] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(true); // State for fullscreen mode

  const fetchMessages = async () => {
    try {
      const res = await fetch(`https://major-project-backend-okz9.onrender.com/api/messages/department/${department}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  // Fetch on department change
  useEffect(() => {
    fetchMessages();
  }, [department]);

  // Real-time update
  useEffect(() => {
    socket.on('new-message', (newMsg) => {
      if (newMsg.department === department) {
        setMessages(prev => [newMsg, ...prev]);
      }
    });
    return () => socket.off('new-message');
  }, [department]);

  // Fullscreen functionality
  const goFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  };

  const handleFullscreenToggle = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      goFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  // Auto-refresh on ESC key press
  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      if (!isFullscreen) {
        goFullscreen(); // Re-enter fullscreen if ESC is pressed
        setIsFullscreen(true);
      }
    }
  };

  // Adding the event listener for ESC key press
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isFullscreen]);

  // Set fullscreen on load
  useEffect(() => {
    if (isFullscreen) {
      goFullscreen();
    }
  }, [isFullscreen]);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-primary via-secondary to-accent animate-gradient-x text-light flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <header className="text-center py-6 bg-black bg-opacity-30">
        <h1 className="text-4xl font-bold tracking-widest">SMART REAL-TIME IoT-BASED NOTICE BOARD WITH ROLE-BASED ACCESS CONTROL</h1>
      </header>

      {/* Department Selector */}
      <div className="flex justify-center mt-2 z-10">
        <select
          value={department}
          onChange={e => setDepartment(e.target.value)}
          className="text-black p-2 rounded shadow-md bg-light"
        >
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="ME">ME</option>
          <option value="CE">CE</option>
        </select>
      </div>

      {/* Fullscreen toggle button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={handleFullscreenToggle}
          className="bg-white text-black p-2 rounded shadow-md hover:bg-light"
        >
          {isFullscreen ? '><' : '<>'}
        </button>
      </div>

      {/* Auto-scrolling messages */}
      <main className="relative flex-grow overflow-hidden mt-4">
        {messages.length > 0 ? (
          <div className="absolute animate-scroll space-y-8 px-6 w-full">
            {messages.map((msg, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-10 p-4 rounded shadow-lg backdrop-blur-sm max-w-3xl mx-auto text-center"
              >
                <p className="text-xl font-medium">{msg.content}</p>
                <p className="text-sm text-gray-300 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg mt-10">No messages for {department}</p>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 bg-black bg-opacity-30 z-10">
        <p className="text-sm tracking-wider">© 2025 Smart Notice Board | Final Year Project by Om Kumar Singh and Shagun Singh under the guidance of Dr. Arun Kumar G. (HOD ECE, JSSATE Noida)</p>
      </footer>
    </div>
  );
};

export default App;
