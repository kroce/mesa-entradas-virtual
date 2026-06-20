import type { Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';
import { OrganismoService } from '../services/OrganismoService.js';
import {
  validateCreateOrganismoInput,
  validateUpdateOrganismoInput,
} from '../validations/organismoValidation.js';

export class OrganismoController {
  constructor(private readonly organismoService: OrganismoService) {}

  list = (_req: Request, res: Response): void => {
    const organismos = this.organismoService.list();

    res.json(organismos);
  };

  create = (req: Request, res: Response): void => {
    const input = validateCreateOrganismoInput(req.body);

    const organismo = this.organismoService.create(input);

    res.status(201).json(organismo);
  };

  update = (req: Request, res: Response): void => {
    const { codigo } = req.params;

    if (typeof codigo !== 'string' || !codigo.trim()) {
      throw new AppError('Código de organismo inválido', 400);
    }

    const input = validateUpdateOrganismoInput(req.body);

    const organismo = this.organismoService.update(codigo, input);

    res.json(organismo);
  };
}
