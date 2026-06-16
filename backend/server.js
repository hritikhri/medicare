const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = require('./src/app');
const httpServer = createServer(app);    

const io = new Server(httpServer, {   
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3000', methods: ['GET', 'POST'] }
});

// Load socket modules
require('./src/sockets/chat')(io);
require('./src/sockets/calls')(io);
require('./src/sockets/notifications')(io);

const PORT = process.env.PORT || 6000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));