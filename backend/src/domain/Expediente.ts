export type ExpedienteTipo = 'EXP' | 'LEG';

export type Expediente = {
  clave: string;
  organismoCodigo: string;
  tipo: ExpedienteTipo;
  numero: number;
  anio: number;
  caratula: string;
  ciudadCodigo: string;
};

export type ExpedientePersonaInput = {
  personaDni: string;
  tipoVinculoId: number;
};

export type ExpedientePersona = {
  dni: string;
  apellido: string;
  nombre: string;
  tipoVinculoId: number;
  tipoVinculoDescripcion: string;
};

export type ExpedienteConVinculo = Expediente & {
  tipoVinculoId: number;
  tipoVinculoDescripcion: string;
};

export type CreateExpedienteInput = {
  organismoCodigo: string;
  tipo: ExpedienteTipo;
  numero: number;
  anio: number;
  caratula: string;
  ciudadCodigo: string;
  personas: ExpedientePersonaInput[];
};
