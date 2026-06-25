import type {
  CreateExpedienteInput,
  ExpedienteTipo,
  UpdateExpedienteInput,
  UpdateExpedientePersonasInput,
} from '../domain/Expediente.js';
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

export function validateUpdateExpedienteInput(input: unknown): UpdateExpedienteInput {
  if (!isRecord(input)) {
    throw new AppError('Body inválido', 400);
  }

  const { caratula } = input;

  if (typeof caratula !== 'string') {
    throw new AppError('Carátula es obligatoria', 400);
  }

  if (!caratula.trim()) {
    throw new AppError('Carátula es obligatoria', 400);
  }

  return {
    caratula: caratula.trim(),
  };
}

export function validateUpdateExpedientePersonasInput(
  input: unknown,
): UpdateExpedientePersonasInput {
  if (!isRecord(input)) {
    throw new AppError('Body inválido', 400);
  }

  const { personas } = input;

  if (!Array.isArray(personas)) {
    throw new AppError('Personas es obligatorio', 400);
  }

  if (personas.length === 0) {
    throw new AppError('El expediente debe tener al menos una persona asociada', 400);
  }

  const personasValidadas = personas.map(validateExpedientePersonaInput);

  const dnis = personasValidadas.map((persona) => persona.personaDni);
  const dnisUnicos = new Set(dnis);

  if (dnis.length !== dnisUnicos.size) {
    throw new AppError('No puede haber personas repetidas en el expediente', 400);
  }

  return {
    personas: personasValidadas,
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
