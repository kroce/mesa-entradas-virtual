import { db } from '../database/db.js';
import type {
  CreateExpedienteInput,
  Expediente,
  ExpedientePersona,
  ExpedienteConVinculo,
  UpdateExpedienteInput,
  UpdateExpedientePersonasInput,
} from '../domain/Expediente.js';

type ExpedienteRow = {
  clave: string;
  organismoCodigo: string;
  tipo: 'EXP' | 'LEG';
  numero: number;
  anio: number;
  caratula: string;
  ciudadCodigo: string;
};

export class ExpedienteRepository {
  findAll(): Expediente[] {
    const statement = db.prepare(`
      SELECT
        clave,
        organismo_codigo AS organismoCodigo,
        tipo,
        numero,
        anio,
        caratula,
        ciudad_codigo AS ciudadCodigo
      FROM expedientes
      ORDER BY anio DESC, numero DESC
    `);

    return statement.all() as Expediente[];
  }

  findByClave(clave: string): Expediente | null {
    const statement = db.prepare(`
      SELECT
        clave,
        organismo_codigo AS organismoCodigo,
        tipo,
        numero,
        anio,
        caratula,
        ciudad_codigo AS ciudadCodigo
      FROM expedientes
      WHERE clave = ?
    `);

    const expediente = statement.get(clave) as ExpedienteRow | undefined;

    return expediente ?? null;
  }

  findOrganismoCiudadCodigo(organismoCodigo: string): string | null {
    const statement = db.prepare(`
    SELECT ciudad_codigo AS ciudadCodigo
    FROM organismos
    WHERE codigo = ?
  `);

    const result = statement.get(organismoCodigo) as { ciudadCodigo: string } | undefined;

    return result?.ciudadCodigo ?? null;
  }

  findPersonasByClave(expedienteClave: string): ExpedientePersona[] {
    const statement = db.prepare(`
    SELECT 
      p.dni,
      p.apellido,
      p.nombre,
      tv.id AS tipoVinculoId,
      tv.descripcion AS tipoVinculoDescripcion
    FROM expediente_personas ep
    JOIN personas p ON p.dni = ep.persona_dni
    JOIN tipos_vinculo tv ON tv.id = ep.tipo_vinculo_id
    WHERE ep.expediente_clave = ?
    ORDER BY tv.id, p.apellido, p.nombre
  `);

    return statement.all(expedienteClave) as ExpedientePersona[];
  }

  findByPersonaDni(personaDni: string): ExpedienteConVinculo[] {
    const statement = db.prepare(`
    SELECT
      e.clave,
      e.organismo_codigo AS organismoCodigo,
      e.tipo,
      e.numero,
      e.anio,
      e.caratula,
      e.ciudad_codigo AS ciudadCodigo,
			tv.id AS tipoVinculoId,
      tv.descripcion AS tipoVinculoDescripcion
    FROM expedientes e
    JOIN expediente_personas ep ON ep.expediente_clave = e.clave
		JOIN tipos_vinculo tv ON tv.id = ep.tipo_vinculo_id
    WHERE ep.persona_dni = ?
    ORDER BY e.anio DESC, e.numero DESC
  `);

    return statement.all(personaDni) as ExpedienteConVinculo[];
  }

  create(input: CreateExpedienteInput & { clave: string }): Expediente {
    const createExpedienteStatement = db.prepare(`
    INSERT INTO expedientes (
      clave,
      organismo_codigo,
      tipo,
      numero,
      anio,
      caratula,
      ciudad_codigo
    ) VALUES (
      @clave,
      @organismoCodigo,
      @tipo,
      @numero,
      @anio,
      @caratula,
      @ciudadCodigo
    )
  `);

    const createExpedientePersonaStatement = db.prepare(`
    INSERT INTO expediente_personas (
      expediente_clave,
      persona_dni,
      tipo_vinculo_id
    ) VALUES (
      @expedienteClave,
      @personaDni,
      @tipoVinculoId
    )
  `);

    const createTransaction = db.transaction(
      (transactionInput: CreateExpedienteInput & { clave: string }) => {
        createExpedienteStatement.run({
          clave: transactionInput.clave,
          organismoCodigo: transactionInput.organismoCodigo,
          tipo: transactionInput.tipo,
          numero: transactionInput.numero,
          anio: transactionInput.anio,
          caratula: transactionInput.caratula,
          ciudadCodigo: transactionInput.ciudadCodigo,
        });

        for (const persona of transactionInput.personas) {
          createExpedientePersonaStatement.run({
            expedienteClave: transactionInput.clave,
            personaDni: persona.personaDni,
            tipoVinculoId: persona.tipoVinculoId,
          });
        }
      },
    );

    createTransaction(input);

    const createdExpediente = this.findByClave(input.clave);

    if (!createdExpediente) {
      throw new Error('Created expediente could not be loaded');
    }

    return createdExpediente;
  }

  update(clave: string, input: UpdateExpedienteInput): Expediente {
    const statement = db.prepare(`
    UPDATE expedientes
    SET caratula = @caratula
    WHERE clave = @clave
  `);

    statement.run({
      clave,
      caratula: input.caratula,
    });

    const updatedExpediente = this.findByClave(clave);

    if (!updatedExpediente) {
      throw new Error('Updated expediente could not be loaded');
    }

    return updatedExpediente;
  }

  replacePersonas(
    expedienteClave: string,
    personas: UpdateExpedientePersonasInput['personas'],
  ): ExpedientePersona[] {
    const deleteStatement = db.prepare(`
    DELETE FROM expediente_personas
    WHERE expediente_clave = ?
  `);

    const insertStatement = db.prepare(`
    INSERT INTO expediente_personas (
      expediente_clave,
      persona_dni,
      tipo_vinculo_id
    ) VALUES (
      @expedienteClave,
      @personaDni,
      @tipoVinculoId
    )
  `);

    const replaceTransaction = db.transaction(
      (transactionInput: {
        expedienteClave: string;
        personas: UpdateExpedientePersonasInput['personas'];
      }) => {
        deleteStatement.run(transactionInput.expedienteClave);

        for (const persona of transactionInput.personas) {
          insertStatement.run({
            expedienteClave: transactionInput.expedienteClave,
            personaDni: persona.personaDni,
            tipoVinculoId: persona.tipoVinculoId,
          });
        }
      },
    );

    replaceTransaction({
      expedienteClave,
      personas,
    });

    return this.findPersonasByClave(expedienteClave);
  }

  allPersonasExist(personaDnis: string[]): boolean {
    const uniquePersonaDnis = [...new Set(personaDnis)];

    if (uniquePersonaDnis.length === 0) {
      return true;
    }

    const placeholders = uniquePersonaDnis.map(() => '?').join(', ');

    const statement = db.prepare(`
    SELECT COUNT(*) AS count
    FROM personas
    WHERE dni IN (${placeholders})
  `);

    const result = statement.get(...uniquePersonaDnis) as { count: number };

    return result.count === uniquePersonaDnis.length;
  }

  allTiposVinculoExist(tipoVinculoIds: number[]): boolean {
    const uniqueTipoVinculoIds = [...new Set(tipoVinculoIds)];

    if (uniqueTipoVinculoIds.length === 0) {
      return true;
    }

    const placeholders = uniqueTipoVinculoIds.map(() => '?').join(', ');

    const statement = db.prepare(`
    SELECT COUNT(*) AS count
    FROM tipos_vinculo
    WHERE id IN (${placeholders})
  `);

    const result = statement.get(...uniqueTipoVinculoIds) as { count: number };

    return result.count === uniqueTipoVinculoIds.length;
  }
}
