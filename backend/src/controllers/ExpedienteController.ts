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

  listPersonasByExpediente = (req: Request, res: Response): void => {
    const { clave } = req.params;

    if (typeof clave !== 'string') {
      res.status(400).json({ message: 'Expediente clave is required' });
      return;
    }

    const personas = this.expedienteService.findPersonasByClave(clave);

    res.json(personas);
  };

  listByPersona = (req: Request, res: Response): void => {
    const { dni } = req.params;

    if (typeof dni !== 'string') {
      res.status(400).json({ message: 'Persona DNI is required' });
      return;
    }

    const expedientes = this.expedienteService.findByPersonaDni(dni);

    res.json(expedientes);
  };
}
