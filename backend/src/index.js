import express from 'express';
import connectDB from './config/db.js';
import clienteRoutes from './routes/clienteRoutes.js';
import loteRoutes from './routes/loteRoutes.js';
import pagosRoutes from './routes/pagosRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ['GET'],
  credentials: true,
}));

// Rutas
app.use('/api', clienteRoutes);
app.use('/api', loteRoutes);
app.use('/api', pagosRoutes);

export default app;