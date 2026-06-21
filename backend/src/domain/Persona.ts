export type Persona = {
  dni: string;
  apellido: string;
  nombre: string;
};

export type CreatePersonaInput = Persona;

export type UpdatePersonaInput = Omit<Persona, 'dni'>;
