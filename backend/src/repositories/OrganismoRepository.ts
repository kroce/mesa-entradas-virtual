import { db } from '../database/db.js';
import type { Organismo } from '../domain/Organismo.js';

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
}
