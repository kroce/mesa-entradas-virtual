import type { CreatePersonaInput, UpdatePersonaInput } from '../domain/Persona.js';
import { AppError } from '../errors/AppError.js';

export function validateCreatePersonaInput(input: unknown): CreatePersonaInput {
  if (!isRecord(input)) {
    throw new AppError('Body inválido', 400);
  }

  const { dni, apellido, nombre } = input;

  if (typeof dni !== 'string' || typeof apellido !== 'string' || typeof nombre !== 'string') {
    throw new AppError('Todos los campos son obligatorios', 400);
  }

  if (!dni.trim() || !apellido.trim() || !nombre.trim()) {
    throw new AppError('Todos los campos son obligatorios', 400);
  }

  return {
    dni: dni.trim(),
    apellido: apellido.trim(),
    nombre: nombre.trim(),
  };
}

export function validateUpdatePersonaInput(input: unknown): UpdatePersonaInput {
  if (!isRecord(input)) {
    throw new AppError('Body inválido', 400);
  }

  const { apellido, nombre } = input;

  if (typeof apellido !== 'string' || typeof nombre !== 'string') {
    throw new AppError('Todos los campos son obligatorios', 400);
  }

  if (!apellido.trim() || !nombre.trim()) {
    throw new AppError('Todos los campos son obligatorios', 400);
  }

  return {
    apellido: apellido.trim(),
    nombre: nombre.trim(),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
