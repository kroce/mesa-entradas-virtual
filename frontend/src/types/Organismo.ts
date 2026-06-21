export type Ciudad = 'Neuquén' | 'Zapala' | 'Junín de los Andes';

export type Fuero = 'Ejecutivos' | 'Civil' | 'Laboral' | 'Familia';

export type Organismo = {
  codigo: string;
  nombre: string;
  caratula: string;
  ciudad: Ciudad;
  fuero: Fuero;
};

export type CreateOrganismoInput = Omit<Organismo, 'codigo'>;

export type UpdateOrganismoInput = Omit<Organismo, 'codigo'>;
