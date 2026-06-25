import { useEffect, useState } from 'react';
import { Alert, Card, Space, Spin, Typography } from 'antd';
import { createExpediente, getExpedientes, getPersonasByExpediente } from '../api/expedientes';
import { getOrganismos } from '../api/organismos';
import { getPersonas } from '../api/personas';
import { ExpedienteForm } from '../components/ExpedienteForm';
import type { CreateExpedienteInput, Expediente, ExpedientePersona } from '../types/Expediente';
import type { Organismo } from '../types/Organismo';
import type { Persona } from '../types/Persona';

import { ExpedienteEditModal } from '../components/ExpedienteEditModal';
import { ExpedientesList } from '../components/ExpedientesList';
import { ExpedientePersonasEditModal } from '../components/ExpedientePersonasEditModal';
import { ExpedientePersonasModal } from '../components/ExpedientePersonasModal';
import { useAutoClearMessage } from '../hooks/useAutoClearMessage';

const { Title } = Typography;

export function ExpedientesPage() {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [editingPersonasExpediente, setEditingPersonasExpediente] = useState<Expediente | null>(
    null,
  );
  const [organismos, setOrganismos] = useState<Organismo[]>([]);
  const [personasDisponibles, setPersonasDisponibles] = useState<Persona[]>([]);
  const [personasAsociadas, setPersonasAsociadas] = useState<ExpedientePersona[]>([]);
  const [selectedExpediente, setSelectedExpediente] = useState<Expediente | null>(null);
  const [editingExpediente, setEditingExpediente] = useState<Expediente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPersonas, setIsLoadingPersonas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useAutoClearMessage(successMessage, setSuccessMessage);

  async function handleCreateExpediente(input: CreateExpedienteInput) {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const createdExpediente = await createExpediente(input);

      setExpedientes((currentExpedientes) => [createdExpediente, ...currentExpedientes]);

      setSuccessMessage(`Expediente ${createdExpediente.clave} creado correctamente.`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'No se pudo crear el expediente.';

      setError(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleViewPersonas(expediente: Expediente) {
    setSelectedExpediente(expediente);
    setPersonasAsociadas([]);
    setIsLoadingPersonas(true);
    setError(null);

    try {
      const data = await getPersonasByExpediente(expediente.clave);
      setPersonasAsociadas(data);
    } catch {
      setError('No se pudieron cargar las personas del expediente.');
    } finally {
      setIsLoadingPersonas(false);
    }
  }

  useEffect(() => {
    let ignore = false;

    async function loadInitialData() {
      try {
        const [expedientesData, organismosData, personasData] = await Promise.all([
          getExpedientes(),
          getOrganismos(),
          getPersonas(),
        ]);

        if (!ignore) {
          setExpedientes(expedientesData);
          setOrganismos(organismosData);
          setPersonasDisponibles(personasData);
        }
      } catch {
        if (!ignore) {
          setError('No se pudieron cargar los datos iniciales.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialData();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      {error && <Alert type="error" title={error} />}

      {successMessage && (
        <Alert
          type="success"
          title={successMessage}
          showIcon
          closable={{
            onClose: () => setSuccessMessage(null),
          }}
        />
      )}

      <Card>
        <Title level={2}>Nuevo expediente</Title>

        <div className="form-container">
          {isLoading ? (
            <Spin />
          ) : (
            <ExpedienteForm
              organismos={organismos}
              personas={personasDisponibles}
              isSubmitting={isSubmitting}
              onSubmit={handleCreateExpediente}
            />
          )}
        </div>
      </Card>

      <ExpedientesList
        expedientes={expedientes}
        isLoading={isLoading}
        onViewPersonas={handleViewPersonas}
        onEditExpediente={setEditingExpediente}
      />

      <ExpedientePersonasModal
        expediente={selectedExpediente}
        personas={personasAsociadas}
        isLoading={isLoadingPersonas}
        onClose={() => {
          setSelectedExpediente(null);
          setPersonasAsociadas([]);
        }}
        onEditPersonas={(expediente) => {
          setEditingPersonasExpediente(expediente);
          setSelectedExpediente(null);
        }}
      />

      <ExpedientePersonasEditModal
        expediente={editingPersonasExpediente}
        personasAsociadas={personasAsociadas}
        personasDisponibles={personasDisponibles}
        onClose={() => {
          setEditingPersonasExpediente(null);
          setPersonasAsociadas([]);
        }}
        onUpdated={(updatedPersonas) => {
          setPersonasAsociadas(updatedPersonas);
          setSuccessMessage(
            `Personas del expediente ${editingPersonasExpediente?.clave} actualizadas correctamente.`,
          );
          setEditingPersonasExpediente(null);
        }}
      />

      <ExpedienteEditModal
        expediente={editingExpediente}
        onClose={() => setEditingExpediente(null)}
        onUpdated={(updatedExpediente) => {
          setExpedientes((currentExpedientes) =>
            currentExpedientes.map((expediente) =>
              expediente.clave === updatedExpediente.clave ? updatedExpediente : expediente,
            ),
          );

          setSuccessMessage(`Expediente ${updatedExpediente.clave} actualizado correctamente.`);
          setEditingExpediente(null);
        }}
      />
    </Space>
  );
}
