import type { ExpedienteTipo } from './Expediente.js';

export function buildExpedienteClave(
  organismoCodigo: string,
  tipo: ExpedienteTipo,
  numero: number,
  anio: number,
): string {
  return `${organismoCodigo} ${tipo} ${numero}/${anio}`;
}
