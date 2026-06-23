import type { Request, Response } from 'express';

import { EstadisticasService } from '../services/EstadisticasService.js';

export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  getEstadisticas = (_req: Request, res: Response): void => {
    const estadisticas = this.estadisticasService.getEstadisticas();

    res.json(estadisticas);
  };
}
