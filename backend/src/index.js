import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import clienteRoutes from './routes/clienteRoutes.js';
import loteRoutes from './routes/loteRoutes.js';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// app.use(cors({
//   origin: process.env.FRONTEND_URL || "http://localhost:5173",
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));

// Rutas
app.use('/api', clienteRoutes);
app.use('/api', loteRoutes);

export default app;