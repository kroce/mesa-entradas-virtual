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

expedienteRoutes.patch('/expedientes/:clave', expedienteController.update);
expedienteRoutes.patch('/expedientes/:clave/personas', expedienteController.updatePersonas);

expedienteRoutes.get('/expedientes/:clave/personas', expedienteController.listPersonasByExpediente);
expedienteRoutes.get('/personas/:dni/expedientes', expedienteController.listByPersona);
