import { Router } from 'express';

import { ExpedienteController } from '../controllers/ExpedienteController.js';
import { ExpedienteRepository } from '../repositories/ExpedienteRepository.js';
import { ExpedienteService } from '../services/ExpedienteService.js';

const expedienteRepository = new ExpedienteRepository();
const expedienteService = new ExpedienteService(expedienteRepository);
const expedienteController = new ExpedienteController(expedienteService);

export const expedienteRoutes = Router();

expedienteRoutes.get('/expedientes', expedienteController.list);
expedienteRoutes.post('/expedientes', expedienteController.create);
