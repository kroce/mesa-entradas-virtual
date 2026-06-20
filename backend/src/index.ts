import cors from 'cors';
import express from 'express';
import { initDatabase } from './database/db.js';

initDatabase();
const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
