import { useEffect, useState } from 'react';
import { Alert, Card, Space, Spin, Table, Typography } from 'antd';
import type { TableProps } from 'antd';

import { getEstadisticas } from '../api/estadisticas';
import type {
  EstadisticasExpedientes,
  ExpedientesPorAnio,
  ExpedientesPorCiudad,
  ExpedientesPorFuero,
} from '../types/Estadisticas';

const { Title } = Typography;

export function EstadisticasPage() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasExpedientes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadEstadisticas() {
      try {
        const data = await getEstadisticas();

        if (!ignore) {
          setEstadisticas(data);
        }
      } catch {
        if (!ignore) {
          setError('No se pudieron cargar las estadísticas.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadEstadisticas();

    return () => {
      ignore = true;
    };
  }, []);

  const anioColumns: TableProps<ExpedientesPorAnio>['columns'] = [
    {
      title: 'Año',
      dataIndex: 'anio',
      key: 'anio',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
  ];

  const ciudadColumns: TableProps<ExpedientesPorCiudad>['columns'] = [
    {
      title: 'Código',
      dataIndex: 'ciudadCodigo',
      key: 'ciudadCodigo',
    },
    {
      title: 'Ciudad',
      dataIndex: 'ciudadNombre',
      key: 'ciudadNombre',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
  ];

  const fueroColumns: TableProps<ExpedientesPorFuero>['columns'] = [
    {
      title: 'Código',
      dataIndex: 'fueroCodigo',
      key: 'fueroCodigo',
    },
    {
      title: 'Fuero',
      dataIndex: 'fueroNombre',
      key: 'fueroNombre',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
  ];

  if (isLoading) {
    return <Spin />;
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      {error && <Alert type="error" title={error} />}

      <Card>
        <Title level={2}>Estadísticas</Title>

        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <Card type="inner" title="Expedientes por año">
            <Table
              className="large-table"
              rowKey="anio"
              columns={anioColumns}
              dataSource={estadisticas?.expedientesPorAnio ?? []}
              pagination={false}
            />
          </Card>

          <Card type="inner" title="Expedientes por ciudad">
            <Table
              className="large-table"
              rowKey="ciudadCodigo"
              columns={ciudadColumns}
              dataSource={estadisticas?.expedientesPorCiudad ?? []}
              pagination={false}
            />
          </Card>

          <Card type="inner" title="Expedientes por fuero">
            <Table
              className="large-table"
              rowKey="fueroCodigo"
              columns={fueroColumns}
              dataSource={estadisticas?.expedientesPorFuero ?? []}
              pagination={false}
            />
          </Card>
        </Space>
      </Card>
    </Space>
  );
}
