import type { EstadisticasExpedientes } from '../types/Estadisticas';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

export async function getEstadisticas(): Promise<EstadisticasExpedientes> {
  const response = await fetch(`${API_BASE_URL}/estadisticas`);

  if (!response.ok) {
    throw new Error('No se pudieron obtener las estadísticas');
  }

  return response.json() as Promise<EstadisticasExpedientes>;
}
