export type ExpedientesPorAnio = {
  anio: number;
  total: number;
};

export type ExpedientesPorCiudad = {
  ciudadCodigo: string;
  ciudadNombre: string;
  total: number;
};

export type ExpedientesPorFuero = {
  fueroCodigo: string;
  fueroNombre: string;
  total: number;
};

export type EstadisticasExpedientes = {
  expedientesPorAnio: ExpedientesPorAnio[];
  expedientesPorCiudad: ExpedientesPorCiudad[];
  expedientesPorFuero: ExpedientesPorFuero[];
};
