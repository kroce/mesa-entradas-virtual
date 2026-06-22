import type { CreateOrganismoInput, UpdateOrganismoInput } from '../domain/Organismo.js';
import { AppError } from '../errors/AppError.js';

export function validateCreateOrganismoInput(input: unknown): CreateOrganismoInput {
  if (!isRecord(input)) {
    throw new AppError('Body inválido', 400);
  }

  return validateOrganismoEditableFields(input);
}

export function validateUpdateOrganismoInput(input: unknown): UpdateOrganismoInput {
  if (!isRecord(input)) {
    throw new AppError('Body inválido', 400);
  }

  return validateOrganismoEditableFields(input);
}

function validateOrganismoEditableFields(input: Record<string, unknown>): UpdateOrganismoInput {
  const { nombre, caratula, ciudadCodigo, fueroCodigo } = input;

  if (
    typeof nombre !== 'string' ||
    typeof caratula !== 'string' ||
    typeof ciudadCodigo !== 'string' ||
    typeof fueroCodigo !== 'string'
  ) {
    throw new AppError('Todos los campos son obligatorios', 400);
  }

  if (!nombre.trim() || !caratula.trim() || !ciudadCodigo.trim() || !fueroCodigo.trim()) {
    throw new AppError('Todos los campos son obligatorios', 400);
  }

  return {
    nombre: nombre.trim(),
    caratula: caratula.trim(),
    ciudadCodigo: ciudadCodigo.trim(),
    fueroCodigo: fueroCodigo.trim(),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
