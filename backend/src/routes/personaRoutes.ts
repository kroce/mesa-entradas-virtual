import { Router } from 'express';

import { PersonaController } from '../controllers/PersonaController.js';
import { PersonaRepository } from '../repositories/PersonaRepository.js';
import { PersonaService } from '../services/PersonaService.js';

const personaRepository = new PersonaRepository();
const personaService = new PersonaService(personaRepository);
const personaController = new PersonaController(personaService);

export const personaRoutes = Router();

personaRoutes.get('/personas', personaController.list);
personaRoutes.post('/personas', personaController.create);
personaRoutes.put('/personas/:dni', personaController.update);
personaRoutes.delete('/personas/:dni', personaController.delete);
