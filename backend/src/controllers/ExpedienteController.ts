import type { Request, Response } from 'express';

import { ExpedienteService } from '../services/ExpedienteService.js';
import { validateCreateExpedienteInput } from '../validations/expedienteValidation.js';

export class ExpedienteController {
  constructor(private readonly expedienteService: ExpedienteService) {}

  list = (_req: Request, res: Response): void => {
    const expedientes = this.expedienteService.list();
    res.json(expedientes);
  };

  create = (req: Request, res: Response): void => {
    const input = validateCreateExpedienteInput(req.body);
    const expediente = this.expedienteService.create(input);

    res.status(201).json(expediente);
  };
}
