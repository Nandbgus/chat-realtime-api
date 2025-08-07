import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import router from './routes/index.js';
import { initSocket } from './sockets/socket.js';
import { setSocketIO } from './sockets/socket.instance.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

setSocketIO(io); // <== Tambahkan ini

initSocket(io);

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', router);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
