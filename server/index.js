const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const https = require('https');
const { Server } = require('socket.io');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const codeRoutes = require('./routes/codeRoutes');
const problemRoutes = require('./routes/problemRoutes');
const contestRoutes = require('./routes/contestRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/contests', contestRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'CodeHire API is running!' });
});

// Socket.io collaborative coding
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('code-change', ({ roomId, code }) => {
    socket.to(roomId).emit('code-update', code);
  });

  socket.on('language-change', ({ roomId, language }) => {
    socket.to(roomId).emit('language-update', language);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Keep backend awake on Render
  setInterval(() => {
    https.get('https://codehire-backend-5iy3.onrender.com', () => {
      console.log('Keep alive ping sent');
    }).on('error', () => {});
  }, 840000);
});