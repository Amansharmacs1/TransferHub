const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : 'http://localhost:5173', // Vite default port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

module.exports = corsOptions;
