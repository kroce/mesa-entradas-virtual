import { useEffect, useState } from 'react';
import { Alert, Button, Card, Modal, Spin, Table, Typography } from 'antd';
import type { TableProps } from 'antd';

import { getExpedientes, getPersonasByExpediente } from '../api/expedientes';
import type { Expediente, ExpedientePersona } from '../types/Expediente';

const { Title } = Typography;

export function ExpedientesPage() {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [personas, setPersonas] = useState<ExpedientePersona[]>([]);
  const [selectedExpediente, setSelectedExpediente] = useState<Expediente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPersonas, setIsLoadingPersonas] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    async function loadInitialExpedientes() {
      try {
        const data = await getExpedientes();

        if (!ignore) {
          setExpedientes(data);
        }
      } catch {
        if (!ignore) {
          setError('No se pudieron cargar los expedientes.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialExpedientes();

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

  return (
    <Card>
      <Title level={2}>Expedientes</Title>

      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}

      {isLoading ? (
        <Spin />
      ) : (
        <Table
          className="large-table"
          rowKey="clave"
          columns={columns}
          dataSource={expedientes}
          pagination={{ pageSize: 5 }}
        />
      )}

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
    </Card>
  );
}
