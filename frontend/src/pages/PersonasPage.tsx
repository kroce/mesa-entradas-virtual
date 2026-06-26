import { useEffect, useState } from 'react';
import { Alert, Card, Modal, Space, Spin, Typography } from 'antd';

import { createPersona, getPersonas, updatePersona } from '../api/personas';
import { PersonaForm } from '../components/PersonaForm';
import { PersonasList } from '../components/PersonasList';
import { ExpedientesPorPersona } from '../components/ExpedientesPorPersona';
import { useAutoClearMessage } from '../hooks/useAutoClearMessage';

import type { CreatePersonaInput, Persona, UpdatePersonaInput } from '../types/Persona';

const { Title } = Typography;

export function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useAutoClearMessage(successMessage, setSuccessMessage);

  async function handleCreatePersona(input: CreatePersonaInput) {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const createdPersona = await createPersona(input);

      setPersonas((currentPersonas) => [createdPersona, ...currentPersonas]);

      setSuccessMessage(
        `Persona ${createdPersona.apellido}, ${createdPersona.nombre} creada correctamente.`,
      );
    } catch {
      setError('No se pudo crear la persona.');
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    let ignore = false;

    async function loadInitialPersonas() {
      try {
        const data = await getPersonas();

        if (!ignore) {
          setPersonas(data);
        }
      } catch {
        if (!ignore) {
          setError('No se pudieron cargar las personas.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialPersonas();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleUpdatePersona(input: UpdatePersonaInput) {
    if (!selectedPersona) {
      return;
    }

    setIsUpdating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedPersona = await updatePersona(selectedPersona.dni, input);

      setPersonas((currentPersonas) =>
        currentPersonas.map((persona) =>
          persona.dni === updatedPersona.dni ? updatedPersona : persona,
        ),
      );

      setSuccessMessage(
        `Persona ${updatedPersona.apellido}, ${updatedPersona.nombre} actualizada correctamente.`,
      );
      setSelectedPersona(null);
    } catch {
      setError('No se pudo actualizar la persona.');
    } finally {
      setIsUpdating(false);
    }
  }

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
        <Title level={2}>Nueva persona</Title>

        <div className="form-container">
          <PersonaForm isSubmitting={isSubmitting} onSubmit={handleCreatePersona} />
        </div>
      </Card>

      {isLoading ? (
        <Spin />
      ) : (
        <>
          <PersonasList personas={personas} onEdit={setSelectedPersona} />

          <ExpedientesPorPersona personas={personas} />
        </>
      )}

      <Modal
        className="dark-modal"
        title={selectedPersona ? `Editar persona - ${selectedPersona.dni}` : 'Editar persona'}
        open={selectedPersona !== null}
        onCancel={() => setSelectedPersona(null)}
        footer={null}
        width={600}
      >
        {selectedPersona && (
          <PersonaForm
            initialValues={selectedPersona}
            isDniDisabled
            isSubmitting={isUpdating}
            submitLabel="Guardar cambios"
            resetAfterSubmit={false}
            onSubmit={handleUpdatePersona}
          />
        )}
      </Modal>
    </Space>
  );
}
