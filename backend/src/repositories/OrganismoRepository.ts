import { db } from '../database/db.js';
import type { CreateOrganismoInput, Organismo, UpdateOrganismoInput } from '../domain/Organismo.js';

export class OrganismoRepository {
  findAll(): Organismo[] {
    const statement = db.prepare(`
    SELECT
      o.codigo,
      o.nombre,
      o.caratula,
      o.ciudad_codigo AS ciudadCodigo,
      c.nombre AS ciudadNombre,
      o.fuero_codigo AS fueroCodigo,
      f.nombre AS fueroNombre
    FROM organismos o
    INNER JOIN ciudades c ON c.codigo = o.ciudad_codigo
    INNER JOIN fueros f ON f.codigo = o.fuero_codigo
    ORDER BY o.codigo
  `);

    return statement.all() as Organismo[];
  }

  create(input: CreateOrganismoInput & { codigo: string }): Organismo {
    const statement = db.prepare(`
    INSERT INTO organismos (
      codigo,
      nombre,
      caratula,
      ciudad_codigo,
      fuero_codigo
    ) VALUES (
      @codigo,
      @nombre,
      @caratula,
      @ciudadCodigo,
      @fueroCodigo
    )
  `);

    statement.run(input);

    const createdOrganismo = this.findByCodigo(input.codigo);

    if (!createdOrganismo) {
      throw new Error('Created organismo could not be loaded');
    }

    return createdOrganismo;
  }

  findByCodigo(codigo: string): Organismo | null {
    const statement = db.prepare(`
    SELECT
      o.codigo,
      o.nombre,
      o.caratula,
      o.ciudad_codigo AS ciudadCodigo,
      c.nombre AS ciudadNombre,
      o.fuero_codigo AS fueroCodigo,
      f.nombre AS fueroNombre
    FROM organismos o
    INNER JOIN ciudades c ON c.codigo = o.ciudad_codigo
    INNER JOIN fueros f ON f.codigo = o.fuero_codigo
    WHERE o.codigo = ?
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
      ciudad_codigo = @ciudadCodigo,
      fuero_codigo = @fueroCodigo
    WHERE codigo = @codigo
  `);

    statement.run({
      codigo,
      ...input,
    });

    const updatedOrganismo = this.findByCodigo(codigo);

    if (!updatedOrganismo) {
      throw new Error('Updated organismo could not be loaded');
    }

    return updatedOrganismo;
  }

  delete(codigo: string): void {
    const statement = db.prepare(`
    DELETE FROM organismos
    WHERE codigo = ?
  `);

    statement.run(codigo);
  }
}
