import { useState } from 'react';
import { Button, Card, Input, Table, Typography } from 'antd';
import type { TableProps } from 'antd';

import type { Expediente } from '../types/Expediente';

const { Title } = Typography;

type ExpedientesListProps = {
  expedientes: Expediente[];
  isLoading: boolean;
  onViewPersonas: (expediente: Expediente) => void;
  onEditExpediente?: (expediente: Expediente) => void;
};

export function ExpedientesList({
  expedientes,
  isLoading,
  onViewPersonas,
  onEditExpediente,
}: ExpedientesListProps) {
  const [searchText, setSearchText] = useState('');
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
      width: 160,
      render: (_, expediente) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Button type="link" style={{ padding: 0 }} onClick={() => onViewPersonas(expediente)}>
            Ver personas
          </Button>

          {onEditExpediente && (
            <Button type="link" style={{ padding: 0 }} onClick={() => onEditExpediente(expediente)}>
              Editar
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
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

      <Table
        className="large-table"
        rowKey="clave"
        loading={isLoading}
        columns={columns}
        dataSource={filteredExpedientes}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
        }}
      />
    </Card>
  );
}
