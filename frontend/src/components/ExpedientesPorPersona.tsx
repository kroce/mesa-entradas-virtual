import { useState } from 'react';
import { Alert, Card, Select, Spin, Table, Typography } from 'antd';
import type { TableProps } from 'antd';

import { getExpedientesByPersona } from '../api/expedientes';
import type { ExpedienteConVinculo } from '../types/Expediente';
import type { Persona } from '../types/Persona';

const { Title, Text } = Typography;

type ExpedientesPorPersonaProps = {
  personas: Persona[];
};

export function ExpedientesPorPersona({ personas }: ExpedientesPorPersonaProps) {
  const [selectedPersonaDni, setSelectedPersonaDni] = useState<string | undefined>();
  const [expedientes, setExpedientes] = useState<ExpedienteConVinculo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePersonaChange(personaDni?: string) {
    setSelectedPersonaDni(personaDni);
    setExpedientes([]);
    setError(null);

    if (!personaDni) {
      return;
    }

    setIsLoading(true);

    try {
      const data = await getExpedientesByPersona(personaDni);
      setExpedientes(data);
    } catch {
      setError('No se pudieron cargar los expedientes asociados a la persona.');
    } finally {
      setIsLoading(false);
    }
  }

  const columns: TableProps<ExpedienteConVinculo>['columns'] = [
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
      title: 'Vínculo',
      dataIndex: 'tipoVinculoDescripcion',
      key: 'tipoVinculoDescripcion',
    },
  ];

  return (
    <Card>
      <Title level={2}>Expedientes por persona</Title>

      <Text type="secondary">
        Seleccioná una persona para ver en qué expedientes participa y con qué vínculo.
      </Text>

      <Select
        allowClear
        showSearch={{ optionFilterProp: 'label' }}
        placeholder="Buscar persona por DNI, apellido o nombre"
        value={selectedPersonaDni}
        onChange={(value) => void handlePersonaChange(value)}
        style={{ width: '100%', marginTop: 16, marginBottom: 16 }}
        options={personas.map((persona) => ({
          value: persona.dni,
          label: `${persona.dni} - ${persona.apellido}, ${persona.nombre}`,
        }))}
      />

      {error && <Alert type="error" title={error} style={{ marginBottom: 16 }} />}

      {isLoading ? (
        <Spin />
      ) : (
        <Table
          className="large-table"
          rowKey="clave"
          columns={columns}
          dataSource={expedientes}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50],
          }}
        />
      )}
    </Card>
  );
}
