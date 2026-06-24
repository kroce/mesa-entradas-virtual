import { useEffect, useState } from 'react';
import { Alert, Card, Modal, Space, Spin, Table, Typography } from 'antd';
import type { TableProps } from 'antd';

import { createExpediente, getExpedientes, getPersonasByExpediente } from '../api/expedientes';
import { getOrganismos } from '../api/organismos';
import { getPersonas } from '../api/personas';
import { ExpedienteForm } from '../components/ExpedienteForm';
import type { CreateExpedienteInput, Expediente, ExpedientePersona } from '../types/Expediente';
import type { Organismo } from '../types/Organismo';
import type { Persona } from '../types/Persona';
import { ExpedientesList } from '../components/ExpedientesList';

const { Title } = Typography;

export function ExpedientesPage() {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [organismos, setOrganismos] = useState<Organismo[]>([]);
  const [personasDisponibles, setPersonasDisponibles] = useState<Persona[]>([]);
  const [personas, setPersonas] = useState<ExpedientePersona[]>([]);
  const [selectedExpediente, setSelectedExpediente] = useState<Expediente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPersonas, setIsLoadingPersonas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleCreateExpediente(input: CreateExpedienteInput) {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const createdExpediente = await createExpediente(input);

      setExpedientes((currentExpedientes) => [createdExpediente, ...currentExpedientes]);

      setSuccessMessage(`Expediente ${createdExpediente.clave} creado correctamente.`);
    } catch {
      setError('No se pudo crear el expediente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleViewPersonas(expediente: Expediente) {
    setSelectedExpediente(expediente);
    setPersonas([]);
    setIsLoadingPersonas(true);
    setError(null);

    try {
      const data = await getPersonasByExpediente(expediente.clave);
      setPersonas(data);
    } catch {
      setError('No se pudieron cargar las personas del expediente.');
    } finally {
      setIsLoadingPersonas(false);
    }
  }

  function handleCloseModal() {
    setSelectedExpediente(null);
    setPersonas([]);
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

  const personaColumns: TableProps<ExpedientePersona>['columns'] = [
    {
      title: 'DNI',
      dataIndex: 'dni',
      key: 'dni',
    },
    {
      title: 'Apellido',
      dataIndex: 'apellido',
      key: 'apellido',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Vínculo',
      dataIndex: 'tipoVinculoDescripcion',
      key: 'tipoVinculoDescripcion',
    },
  ];

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
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onViewPersonas={handleViewPersonas}
      />

      <Modal
        className="dark-modal"
        title={`Personas asociadas${selectedExpediente ? ` - ${selectedExpediente.clave}` : ''}`}
        open={selectedExpediente !== null}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
      >
        {isLoadingPersonas ? (
          <Spin />
        ) : (
          <Table rowKey="dni" columns={personaColumns} dataSource={personas} pagination={false} />
        )}
      </Modal>
    </Space>
  );
}
