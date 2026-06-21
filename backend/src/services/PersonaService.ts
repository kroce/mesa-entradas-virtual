import type { CreatePersonaInput, Persona, UpdatePersonaInput } from '../domain/Persona.js';
import { AppError } from '../errors/AppError.js';
import { PersonaRepository } from '../repositories/PersonaRepository.js';

export class PersonaService {
  constructor(private readonly personaRepository: PersonaRepository) {}

  list(): Persona[] {
    return this.personaRepository.findAll();
  }

  create(input: CreatePersonaInput): Persona {
    const existingPersona = this.personaRepository.findByDni(input.dni);

    if (existingPersona) {
      throw new AppError('Ya existe una persona con ese DNI', 409);
    }

    return this.personaRepository.create(input);
  }

  update(dni: string, input: UpdatePersonaInput): Persona {
    const existingPersona = this.personaRepository.findByDni(dni);

    if (!existingPersona) {
      throw new AppError('Persona no encontrada', 404);
    }

    return this.personaRepository.update(dni, input);
  }

  delete(dni: string): void {
    const existingPersona = this.personaRepository.findByDni(dni);

    if (!existingPersona) {
      throw new AppError('Persona no encontrada', 404);
    }

    this.personaRepository.delete(dni);
  }
}
