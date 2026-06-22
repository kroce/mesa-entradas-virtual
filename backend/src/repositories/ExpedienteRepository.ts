import { db } from '../database/db.js';
import type { CreateExpedienteInput, Expediente } from '../domain/Expediente.js';

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
}
