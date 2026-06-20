import type { Request, Response } from 'express';

import { OrganismoService } from '../services/OrganismoService.js';
import { validateCreateOrganismoInput } from '../validations/organismoValidation.js';

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
}
