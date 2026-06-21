import type { Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';
import { PersonaService } from '../services/PersonaService.js';
import {
  validateCreatePersonaInput,
  validateUpdatePersonaInput,
} from '../validations/personaValidation.js';

export class PersonaController {
  constructor(private readonly personaService: PersonaService) {}

  list = (_req: Request, res: Response): void => {
    const personals = this.personaService.list();

    res.json(personals);
  };

  create = (req: Request, res: Response): void => {
    const input = validateCreatePersonaInput(req.body);

    const persona = this.personaService.create(input);

    res.status(201).json(persona);
  };

  update = (req: Request, res: Response): void => {
    const { dni } = req.params;

    if (typeof dni !== 'string' || !dni.trim()) {
      throw new AppError('DNI inválido', 400);
    }

    const input = validateUpdatePersonaInput(req.body);

    const persona = this.personaService.update(dni, input);

    res.json(persona);
  };

  delete = (req: Request, res: Response): void => {
    const { dni } = req.params;

    if (typeof dni !== 'string' || !dni.trim()) {
      throw new AppError('DNI inválido', 400);
    }

    this.personaService.delete(dni);

    res.status(204).send();
  };
}
