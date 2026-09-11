import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'AbhayaSetu API (SafeRoute Bridge)',
    status: 'online',
    documentation: '/api/health'
  });
});

app.listen(PORT, () => {
  console.log(`[AbhayaSetu API] Server running on http://localhost:${PORT}`);
});
