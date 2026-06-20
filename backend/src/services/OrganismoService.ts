import type { CreateOrganismoInput, Organismo } from '../domain/Organismo.js';
import { OrganismoRepository } from '../repositories/OrganismoRepository.js';
import { AppError } from '../errors/AppError.js';

export class OrganismoService {
  constructor(private readonly organismoRepository: OrganismoRepository) {}

  list(): Organismo[] {
    return this.organismoRepository.findAll();
  }

  create(input: CreateOrganismoInput): Organismo {
    const existingOrganismo = this.organismoRepository.findByCodigo(input.codigo);

    if (existingOrganismo) {
      throw new AppError('Ya existe un organismo con ese código', 409);
    }

    return this.organismoRepository.create(input);
  }
}
