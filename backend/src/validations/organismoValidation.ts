import type { CreateOrganismoInput, Ciudad, Fuero } from '../domain/Organismo.js';
import { AppError } from '../errors/AppError.js';

export function validateCreateOrganismoInput(input: unknown): CreateOrganismoInput {
  if (!isRecord(input)) {
    throw new AppError('Body inválido', 400);
  }

  const { codigo, nombre, caratula, ciudad, fuero } = input;

  if (
    typeof codigo !== 'string' ||
    typeof nombre !== 'string' ||
    typeof caratula !== 'string' ||
    typeof ciudad !== 'string' ||
    typeof fuero !== 'string'
  ) {
    throw new AppError('Todos los campos son obligatorios', 400);
  }

  if (!codigo.trim() || !nombre.trim() || !caratula.trim() || !ciudad.trim() || !fuero.trim()) {
    throw new AppError('Todos los campos son obligatorios', 400);
  }

  if (!isValidCiudad(ciudad)) {
    throw new AppError('Ciudad inválida', 400);
  }

  if (!isValidFuero(fuero)) {
    throw new AppError('Fuero inválido', 400);
  }

  return {
    codigo: codigo.trim(),
    nombre: nombre.trim(),
    caratula: caratula.trim(),
    ciudad,
    fuero,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isValidCiudad(ciudad: string): ciudad is Ciudad {
  return ciudad === 'Neuquén' || ciudad === 'Zapala' || ciudad === 'Junín de los Andes';
}

function isValidFuero(fuero: string): fuero is Fuero {
  return fuero === 'Ejecutivos' || fuero === 'Civil' || fuero === 'Laboral' || fuero === 'Familia';
}
