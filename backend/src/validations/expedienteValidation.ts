import type { CreateExpedienteInput, ExpedienteTipo } from '../domain/Expediente.js';
import { AppError } from '../errors/AppError.js';

export function validateCreateExpedienteInput(input: unknown): CreateExpedienteInput {
  if (!isRecord(input)) {
    throw new AppError('Body inválido', 400);
  }

  const { organismoCodigo, tipo, numero, anio, caratula, ciudadCodigo, personas } = input;

  if (
    typeof organismoCodigo !== 'string' ||
    typeof tipo !== 'string' ||
    typeof numero !== 'number' ||
    typeof anio !== 'number' ||
    typeof caratula !== 'string' ||
    typeof ciudadCodigo !== 'string' ||
    !Array.isArray(personas)
  ) {
    throw new AppError('Todos los campos son obligatorios', 400);
  }

  if (!organismoCodigo.trim() || !tipo.trim() || !caratula.trim() || !ciudadCodigo.trim()) {
    throw new AppError('Todos los campos son obligatorios', 400);
  }

  if (!isValidExpedienteTipo(tipo)) {
    throw new AppError('Tipo de expediente inválido', 400);
  }

  if (!Number.isInteger(numero) || numero <= 0) {
    throw new AppError('Número de expediente inválido', 400);
  }

  if (!Number.isInteger(anio) || anio <= 0) {
    throw new AppError('Año de expediente inválido', 400);
  }

  return {
    organismoCodigo: organismoCodigo.trim(),
    tipo,
    numero,
    anio,
    caratula: caratula.trim(),
    ciudadCodigo: ciudadCodigo.trim(),
    personas: personas.map(validateExpedientePersonaInput),
  };
}

function validateExpedientePersonaInput(input: unknown) {
  if (!isRecord(input)) {
    throw new AppError('Persona vinculada inválida', 400);
  }

  const { personaDni, tipoVinculoId } = input;

  if (typeof personaDni !== 'string' || typeof tipoVinculoId !== 'number') {
    throw new AppError('Persona vinculada inválida', 400);
  }

  if (!personaDni.trim()) {
    throw new AppError('DNI de persona vinculada inválido', 400);
  }

  if (!Number.isInteger(tipoVinculoId) || tipoVinculoId <= 0) {
    throw new AppError('Tipo de vínculo inválido', 400);
  }

  return {
    personaDni: personaDni.trim(),
    tipoVinculoId,
  };
}

function isValidExpedienteTipo(tipo: string): tipo is ExpedienteTipo {
  return tipo === 'EXP' || tipo === 'LEG';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
