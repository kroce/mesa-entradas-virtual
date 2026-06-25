import type {
  CreateExpedienteInput,
  Expediente,
  ExpedientePersona,
  ExpedienteConVinculo,
  UpdateExpedienteInput,
  UpdateExpedientePersonasInput,
} from '../domain/Expediente.js';
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
    this.validatePersonasUnicas(input);
    this.validatePersonasExistentes(input);
    this.validateTiposVinculoExistentes(input);

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

  update(clave: string, input: UpdateExpedienteInput): Expediente {
    const expediente = this.expedienteRepository.findByClave(clave);

    if (!expediente) {
      throw new AppError('Expediente no encontrado', 404);
    }

    return this.expedienteRepository.update(clave, input);
  }

  updatePersonas(clave: string, input: UpdateExpedientePersonasInput): ExpedientePersona[] {
    const expediente = this.expedienteRepository.findByClave(clave);

    if (!expediente) {
      throw new AppError('Expediente no encontrado', 404);
    }

    this.validateActorPrincipal(input);
    this.validatePersonasUnicas(input);
    this.validatePersonasExistentes(input);
    this.validateTiposVinculoExistentes(input);

    return this.expedienteRepository.replacePersonas(clave, input.personas);
  }

  findPersonasByClave(expedienteClave: string): ExpedientePersona[] {
    const expediente = this.expedienteRepository.findByClave(expedienteClave);

    if (!expediente) {
      throw new AppError('Expediente no encontrado', 404);
    }

    return this.expedienteRepository.findPersonasByClave(expedienteClave);
  }

  findByPersonaDni(personaDni: string): ExpedienteConVinculo[] {
    return this.expedienteRepository.findByPersonaDni(personaDni);
  }

  private validateActorPrincipal(input: { personas: { tipoVinculoId: number }[] }): void {
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

  private validatePersonasUnicas(input: { personas: { personaDni: string }[] }): void {
    const personaDnis = input.personas.map((persona) => persona.personaDni);
    const uniquePersonaDnis = new Set(personaDnis);

    if (personaDnis.length !== uniquePersonaDnis.size) {
      throw new AppError(
        'Una persona no puede estar asociada más de una vez al mismo expediente',
        400,
      );
    }
  }

  private validatePersonasExistentes(input: { personas: { personaDni: string }[] }): void {
    const personaDnis = input.personas.map((persona) => persona.personaDni);
    const allPersonasExist = this.expedienteRepository.allPersonasExist(personaDnis);

    if (!allPersonasExist) {
      throw new AppError('Una o más personas vinculadas no existen', 400);
    }
  }

  private validateTiposVinculoExistentes(input: { personas: { tipoVinculoId: number }[] }): void {
    const tipoVinculoIds = input.personas.map((persona) => persona.tipoVinculoId);
    const allTiposVinculoExist = this.expedienteRepository.allTiposVinculoExist(tipoVinculoIds);

    if (!allTiposVinculoExist) {
      throw new AppError('Uno o más tipos de vínculo no existen', 400);
    }
  }
}
