import { db } from '../database/db.js';

import type {
  EstadisticasExpedientes,
  ExpedientesPorAnio,
  ExpedientesPorCiudad,
  ExpedientesPorFuero,
} from '../domain/Estadisticas.js';

export class EstadisticasRepository {
  getExpedientesPorAnio(): ExpedientesPorAnio[] {
    const statement = db.prepare(`
      SELECT
        anio,
        COUNT(*) AS total
      FROM expedientes
      GROUP BY anio
      ORDER BY anio DESC
    `);

    return statement.all() as ExpedientesPorAnio[];
  }

  getExpedientesPorCiudad(): ExpedientesPorCiudad[] {
    const statement = db.prepare(`
      SELECT
        c.codigo AS ciudadCodigo,
        c.nombre AS ciudadNombre,
        COUNT(*) AS total
      FROM expedientes e
      JOIN ciudades c ON c.codigo = e.ciudad_codigo
      GROUP BY c.codigo, c.nombre
      ORDER BY total DESC, c.nombre ASC
    `);

    return statement.all() as ExpedientesPorCiudad[];
  }

  getExpedientesPorFuero(): ExpedientesPorFuero[] {
    const statement = db.prepare(`
      SELECT
        f.codigo AS fueroCodigo,
        f.nombre AS fueroNombre,
        COUNT(*) AS total
      FROM expedientes e
      JOIN organismos o ON o.codigo = e.organismo_codigo
      JOIN fueros f ON f.codigo = o.fuero_codigo
      GROUP BY f.codigo, f.nombre
      ORDER BY total DESC, f.nombre ASC
    `);

    return statement.all() as ExpedientesPorFuero[];
  }

  getEstadisticas(): EstadisticasExpedientes {
    return {
      expedientesPorAnio: this.getExpedientesPorAnio(),
      expedientesPorCiudad: this.getExpedientesPorCiudad(),
      expedientesPorFuero: this.getExpedientesPorFuero(),
    };
  }
}
