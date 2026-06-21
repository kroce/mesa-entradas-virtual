import { db } from '../database/db.js';
import type { Persona, UpdatePersonaInput } from '../domain/Persona.js';

export class PersonaRepository {
  findAll(): Persona[] {
    const statement = db.prepare(`
      SELECT
        dni,
        apellido,
        nombre
      FROM personas
      ORDER BY apellido, nombre
    `);

    return statement.all() as Persona[];
  }

  findByDni(dni: string): Persona | null {
    const statement = db.prepare(`
      SELECT
        dni,
        apellido,
        nombre
      FROM personas
      WHERE dni = ?
    `);

    const persona = statement.get(dni) as Persona | undefined;

    return persona ?? null;
  }

  create(input: Persona): Persona {
    const statement = db.prepare(`
      INSERT INTO personas (
        dni,
        apellido,
        nombre
      ) VALUES (
        @dni,
        @apellido,
        @nombre
      )
    `);

    statement.run(input);

    return input;
  }

  update(dni: string, input: UpdatePersonaInput): Persona {
    const statement = db.prepare(`
      UPDATE personas
      SET
        apellido = @apellido,
        nombre = @nombre
      WHERE dni = @dni
    `);

    statement.run({
      dni,
      ...input,
    });

    return {
      dni,
      ...input,
    };
  }

  delete(dni: string): void {
    const statement = db.prepare(`
      DELETE FROM personas
      WHERE dni = ?
    `);

    statement.run(dni);
  }
}
