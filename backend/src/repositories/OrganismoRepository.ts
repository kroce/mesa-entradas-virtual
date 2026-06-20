import { db } from '../database/db.js';
import type { CreateOrganismoInput, Organismo, UpdateOrganismoInput } from '../domain/Organismo.js';

export class OrganismoRepository {
  findAll(): Organismo[] {
    const statement = db.prepare(`
      SELECT
        codigo,
        nombre,
        caratula,
        ciudad,
        fuero
      FROM organismos
      ORDER BY codigo
    `);

    return statement.all() as Organismo[];
  }

  create(input: CreateOrganismoInput): Organismo {
    const statement = db.prepare(`
			INSERT INTO organismos (
				codigo,
				nombre,
				caratula,
				ciudad,
				fuero
			) VALUES (
				@codigo,
				@nombre,
				@caratula,
				@ciudad,
				@fuero
			)
		`);

    statement.run(input);

    return input;
  }

  findByCodigo(codigo: string): Organismo | null {
    const statement = db.prepare(`
    SELECT
      codigo,
      nombre,
      caratula,
      ciudad,
      fuero
    FROM organismos
    WHERE codigo = ?
  `);

    const organismo = statement.get(codigo) as Organismo | undefined;

    return organismo ?? null;
  }

  update(codigo: string, input: UpdateOrganismoInput): Organismo {
    const statement = db.prepare(`
    UPDATE organismos
    SET
      nombre = @nombre,
      caratula = @caratula,
      ciudad = @ciudad,
      fuero = @fuero
    WHERE codigo = @codigo
  `);

    statement.run({
      codigo,
      ...input,
    });

    return {
      codigo,
      ...input,
    };
  }

  delete(codigo: string): void {
    const statement = db.prepare(`
    DELETE FROM organismos
    WHERE codigo = ?
  `);

    statement.run(codigo);
  }
}
