import type { Ciudad, Fuero } from './Organismo.js';

const codigoCiudad: Record<Ciudad, string> = {
  Neuquén: 'NQ',
  Zapala: 'ZA',
  'Junín de los Andes': 'JU',
};

const codigoFuero: Record<Fuero, string> = {
  Ejecutivos: 'EJ',
  Civil: 'CI',
  Laboral: 'LA',
  Familia: 'FA',
};

export function buildOrganismoCodigo(ciudad: Ciudad, fuero: Fuero): string {
  return `J${codigoCiudad[ciudad]}${codigoFuero[fuero]}`;
}
