import type { EstadisticasExpedientes } from '../domain/Estadisticas.js';
import { EstadisticasRepository } from '../repositories/EstadisticasRepository.js';

export class EstadisticasService {
  constructor(private readonly estadisticasRepository: EstadisticasRepository) {}

  getEstadisticas(): EstadisticasExpedientes {
    return this.estadisticasRepository.getEstadisticas();
  }
}
