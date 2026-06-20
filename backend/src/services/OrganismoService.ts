import type { Organismo } from '../domain/Organismo.js';
import { OrganismoRepository } from '../repositories/OrganismoRepository.js';

export class OrganismoService {
  constructor(private readonly organismoRepository: OrganismoRepository) {}

  list(): Organismo[] {
    return this.organismoRepository.findAll();
  }
}
