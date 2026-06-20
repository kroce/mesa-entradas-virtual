import type { Request, Response } from 'express';

import { OrganismoService } from '../services/OrganismoService.js';

export class OrganismoController {
  constructor(private readonly organismoService: OrganismoService) {}

  list = (_req: Request, res: Response): void => {
    const organismos = this.organismoService.list();

    res.json(organismos);
  };
}
