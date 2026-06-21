import type { CreateOrganismoInput, Organismo } from '../types/Organismo';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

export async function getOrganismos(): Promise<Organismo[]> {
  const response = await fetch(`${API_BASE_URL}/organismos`);

  if (!response.ok) {
    throw new Error('No se pudieron obtener los organismos');
  }

  return response.json() as Promise<Organismo[]>;
}

export async function createOrganismo(input: CreateOrganismoInput): Promise<Organismo> {
  const response = await fetch(`${API_BASE_URL}/organismos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('No se pudo crear el organismo');
  }

  return response.json() as Promise<Organismo>;
}
