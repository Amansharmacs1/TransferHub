require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const corsOptions = require('./config/cors.config');
const errorHandler = require('./middleware/error.middleware');
const logger = require('./utils/logger');
const healthRoutes = require('./routes/health.routes');
const initializeSocket = require('./socket');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: corsOptions,
});
initializeSocket(io);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', healthRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});