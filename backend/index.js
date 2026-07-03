import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db/database.js';
import authRoutes from './routes/auth.js';
import errandRoutes from './routes/errands.js';
import dashboardRoutes from './routes/dashboard.js';
import profileRoutes from './routes/profile.js';
import reviewRoutes from './routes/reviews.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/errands', errandRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/api/neighbourhoods', (req, res) => {
  const hoods = [
    'Kuniyamuthur', 'Sugunapuram', 'Vadavalli', 'Kovaipudur',
    'R.S. Puram', 'Gandhipuram', 'Saibaba Colony', 'Peelamedu',
    'Singanallur', 'Ganapathy'
  ];
  res.json(hoods);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

async function startServer(port) {
  await connectDB();
  const server = app.listen(port);
  server.on('listening', () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
}

startServer(PORT);
