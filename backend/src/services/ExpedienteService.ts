import type { CreateExpedienteInput, Expediente } from '../domain/Expediente.js';
import { buildExpedienteClave } from '../domain/expedienteClave.js';
import { AppError } from '../errors/AppError.js';
import { ExpedienteRepository } from '../repositories/ExpedienteRepository.js';

const ACTOR_TIPO_VINCULO_ID = 1;

export class ExpedienteService {
  constructor(private readonly expedienteRepository: ExpedienteRepository) {}

  list(): Expediente[] {
    return this.expedienteRepository.findAll();
  }

  create(input: CreateExpedienteInput): Expediente {
    this.validateActorPrincipal(input);

    const clave = buildExpedienteClave(input.organismoCodigo, input.tipo, input.numero, input.anio);

    const existingExpediente = this.expedienteRepository.findByClave(clave);

    if (existingExpediente) {
      throw new AppError('Ya existe un expediente con esa clave', 409);
    }

    return this.expedienteRepository.create({
      clave,
      ...input,
    });
  }

  private validateActorPrincipal(input: CreateExpedienteInput): void {
    const actorCount = input.personas.filter(
      (persona) => persona.tipoVinculoId === ACTOR_TIPO_VINCULO_ID,
    ).length;

    if (actorCount === 0) {
      throw new AppError('El expediente debe tener un actor principal', 400);
    }

    if (actorCount > 1) {
      throw new AppError('El expediente no puede tener más de un actor principal', 400);
    }
  }
}
