export type Organismo = {
  codigo: string;
  nombre: string;
  caratula: string;
  ciudadCodigo: string;
  ciudadNombre: string;
  fueroCodigo: string;
  fueroNombre: string;
};

export type CreateOrganismoInput = {
  nombre: string;
  caratula: string;
  ciudadCodigo: string;
  fueroCodigo: string;
};

export type UpdateOrganismoInput = {
  nombre: string;
  caratula: string;
  ciudadCodigo: string;
  fueroCodigo: string;
};
