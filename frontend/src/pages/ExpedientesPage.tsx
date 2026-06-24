import { useEffect, useState } from 'react';
import { Alert, Button, Card, Input, Modal, Space, Spin, Table, Typography } from 'antd';
import type { TableProps } from 'antd';

import { createExpediente, getExpedientes, getPersonasByExpediente } from '../api/expedientes';
import { getOrganismos } from '../api/organismos';
import { getPersonas } from '../api/personas';
import { ExpedienteForm } from '../components/ExpedienteForm';
import type { CreateExpedienteInput, Expediente, ExpedientePersona } from '../types/Expediente';
import type { Organismo } from '../types/Organismo';
import type { Persona } from '../types/Persona';

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

  const columns: TableProps<Expediente>['columns'] = [
    {
      title: 'Clave',
      dataIndex: 'clave',
      key: 'clave',
    },
    {
      title: 'Carátula',
      dataIndex: 'caratula',
      key: 'caratula',
    },
    {
      title: 'Organismo',
      dataIndex: 'organismoCodigo',
      key: 'organismoCodigo',
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
    },
    {
      title: 'Número',
      dataIndex: 'numero',
      key: 'numero',
    },
    {
      title: 'Año',
      dataIndex: 'anio',
      key: 'anio',
    },
    {
      title: 'Ciudad',
      dataIndex: 'ciudadCodigo',
      key: 'ciudadCodigo',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      align: 'center',
      width: 140,
      render: (_, expediente) => (
        <Button
          type="link"
          style={{ padding: 0 }}
          onClick={() => void handleViewPersonas(expediente)}
        >
          Ver personas
        </Button>
      ),
    },
  ];

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

  const normalizedSearchText = searchText.trim().toLowerCase();
  const shouldFilter = normalizedSearchText.length >= 3;

  const filteredExpedientes = expedientes.filter((expediente) => {
    if (!shouldFilter) {
      return true;
    }

    return (
      expediente.clave.toLowerCase().includes(normalizedSearchText) ||
      expediente.caratula.toLowerCase().includes(normalizedSearchText) ||
      expediente.organismoCodigo.toLowerCase().includes(normalizedSearchText) ||
      expediente.ciudadCodigo.toLowerCase().includes(normalizedSearchText) ||
      expediente.anio.toString().includes(normalizedSearchText) ||
      expediente.numero.toString().includes(normalizedSearchText)
    );
  });

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

      <Card>
        <Title level={2}>Expedientes</Title>

        <div className="search-container">
          <Input.Search
            placeholder="Buscar por clave, carátula, organismo, ciudad, año o número. Mínimo 3 caracteres"
            allowClear
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>

        {isLoading ? (
          <Spin />
        ) : (
          <Table
            className="large-table"
            rowKey="clave"
            columns={columns}
            dataSource={filteredExpedientes}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50],
            }}
          />
        )}
      </Card>

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
