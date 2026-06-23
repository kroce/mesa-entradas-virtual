import { Router } from 'express';

import { EstadisticasController } from '../controllers/EstadisticasController.js';
import { EstadisticasRepository } from '../repositories/EstadisticasRepository.js';
import { EstadisticasService } from '../services/EstadisticasService.js';

const estadisticasRepository = new EstadisticasRepository();
const estadisticasService = new EstadisticasService(estadisticasRepository);
const estadisticasController = new EstadisticasController(estadisticasService);

export const estadisticasRoutes = Router();

estadisticasRoutes.get('/estadisticas', estadisticasController.getEstadisticas);
