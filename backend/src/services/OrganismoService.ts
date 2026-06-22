import type { CreateOrganismoInput, Organismo, UpdateOrganismoInput } from '../domain/Organismo.js';
import { OrganismoRepository } from '../repositories/OrganismoRepository.js';
import { AppError } from '../errors/AppError.js';
import { buildOrganismoCodigo } from '../domain/organismoCodigo.js';

export class OrganismoService {
  constructor(private readonly organismoRepository: OrganismoRepository) {}

  list(): Organismo[] {
    return this.organismoRepository.findAll();
  }

  create(input: CreateOrganismoInput): Organismo {
    const codigo = buildOrganismoCodigo(input.ciudadCodigo, input.fueroCodigo);

    const existingOrganismo = this.organismoRepository.findByCodigo(codigo);

    if (existingOrganismo) {
      throw new AppError('Ya existe un organismo con ese código', 409);
    }

    return this.organismoRepository.create({
      codigo,
      ...input,
    });
  }

  update(codigo: string, input: UpdateOrganismoInput): Organismo {
    const existingOrganismo = this.organismoRepository.findByCodigo(codigo);

    if (!existingOrganismo) {
      throw new AppError('Organismo no encontrado', 404);
    }

    return this.organismoRepository.update(codigo, input);
  }

  delete(codigo: string): void {
    const existingOrganismo = this.organismoRepository.findByCodigo(codigo);

    if (!existingOrganismo) {
      throw new AppError('Organismo no encontrado', 404);
    }

    this.organismoRepository.delete(codigo);
  }
}
