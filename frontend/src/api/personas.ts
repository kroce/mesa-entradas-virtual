import type { CreatePersonaInput, Persona, UpdatePersonaInput } from '../types/Persona';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

export async function getPersonas(): Promise<Persona[]> {
  const response = await fetch(`${API_BASE_URL}/personas`);

  if (!response.ok) {
    throw new Error('No se pudieron obtener las personas');
  }

  return response.json() as Promise<Persona[]>;
}

export async function createPersona(input: CreatePersonaInput): Promise<Persona> {
  const response = await fetch(`${API_BASE_URL}/personas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('No se pudo crear la persona');
  }

  return response.json() as Promise<Persona>;
}

export async function updatePersona(dni: string, input: UpdatePersonaInput): Promise<Persona> {
  const response = await fetch(`${API_BASE_URL}/personas/${dni}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('No se pudo actualizar la persona');
  }

  return response.json() as Promise<Persona>;
}
