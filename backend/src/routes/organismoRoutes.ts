import { Router } from 'express';

import { OrganismoController } from '../controllers/OrganismoController.js';
import { OrganismoRepository } from '../repositories/OrganismoRepository.js';
import { OrganismoService } from '../services/OrganismoService.js';

const organismoRepository = new OrganismoRepository();
const organismoService = new OrganismoService(organismoRepository);
const organismoController = new OrganismoController(organismoService);

export const organismoRoutes = Router();

organismoRoutes.get('/organismos', organismoController.list);
organismoRoutes.post('/organismos', organismoController.create);
organismoRoutes.put('/organismos/:codigo', organismoController.update);
organismoRoutes.delete('/organismos/:codigo', organismoController.delete);
