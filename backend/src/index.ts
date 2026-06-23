import cors from 'cors';
import express from 'express';

import { initDatabase } from './database/db.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { organismoRoutes } from './routes/organismoRoutes.js';
import { personaRoutes } from './routes/personaRoutes.js';
import { expedienteRoutes } from './routes/expedienteRoutes.js';
import { estadisticasRoutes } from './routes/estadisticasRoutes.js';

initDatabase();

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.use('/api', organismoRoutes);
app.use('/api', personaRoutes);
app.use('/api', expedienteRoutes);
app.use('/api', estadisticasRoutes);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
  });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
