export type Persona = {
  dni: string;
  apellido: string;
  nombre: string;
};

export type CreatePersonaInput = {
  dni: string;
  apellido: string;
  nombre: string;
};

export type UpdatePersonaInput = {
  apellido: string;
  nombre: string;
};
