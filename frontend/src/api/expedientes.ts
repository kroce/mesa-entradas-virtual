import type {
  CreateExpedienteInput,
  Expediente,
  ExpedienteConVinculo,
  ExpedientePersona,
  UpdateExpedienteInput,
  UpdateExpedientePersonasInput,
} from '../types/Expediente';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

type ErrorResponse = {
  message?: string;
};

export async function getExpedientes(): Promise<Expediente[]> {
  const response = await fetch(`${API_BASE_URL}/expedientes`);

  if (!response.ok) {
    throw new Error('No se pudieron obtener los expedientes');
  }

  return response.json() as Promise<Expediente[]>;
}

export async function createExpediente(input: CreateExpedienteInput): Promise<Expediente> {
  const response = await fetch(`${API_BASE_URL}/expedientes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ErrorResponse;

    throw new Error(errorData.message ?? 'No se pudo crear el expediente');
  }

  return response.json() as Promise<Expediente>;
}

export async function updateExpediente(
  clave: string,
  input: UpdateExpedienteInput,
): Promise<Expediente> {
  const encodedClave = encodeURIComponent(clave);

  const response = await fetch(`${API_BASE_URL}/expedientes/${encodedClave}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('No se pudo actualizar el expediente');
  }

  return response.json() as Promise<Expediente>;
}

export async function getPersonasByExpediente(clave: string): Promise<ExpedientePersona[]> {
  const encodedClave = encodeURIComponent(clave);

  const response = await fetch(`${API_BASE_URL}/expedientes/${encodedClave}/personas`);

  if (!response.ok) {
    throw new Error('No se pudieron obtener las personas del expediente');
  }

  return response.json() as Promise<ExpedientePersona[]>;
}

export async function updateExpedientePersonas(
  clave: string,
  input: UpdateExpedientePersonasInput,
): Promise<ExpedientePersona[]> {
  const encodedClave = encodeURIComponent(clave);

  const response = await fetch(`${API_BASE_URL}/expedientes/${encodedClave}/personas`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('No se pudieron actualizar las personas del expediente');
  }

  return response.json() as Promise<ExpedientePersona[]>;
}

export async function getExpedientesByPersona(dni: string): Promise<ExpedienteConVinculo[]> {
  const response = await fetch(`${API_BASE_URL}/personas/${dni}/expedientes`);

  if (!response.ok) {
    throw new Error('No se pudieron obtener los expedientes de la persona');
  }

  return response.json() as Promise<ExpedienteConVinculo[]>;
}
