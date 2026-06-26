import { useState } from 'react';
import { Button, Card, Table, Typography } from 'antd';
import type { TableProps } from 'antd';

import type { Persona } from '../types/Persona';

const { Title } = Typography;

type PersonasListProps = {
  personas: Persona[];
  onEdit?: (persona: Persona) => void;
};

export function PersonasList({ personas, onEdit }: PersonasListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns: TableProps<Persona>['columns'] = [
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
      title: 'Acciones',
      key: 'acciones',
      align: 'center',
      width: 120,
      render: (_, persona) => (
        <Button type="link" style={{ padding: 0 }} onClick={() => onEdit?.(persona)}>
          Editar
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <Title level={2}>Personas</Title>

      <Table
        className="large-table"
        rowKey="dni"
        columns={columns}
        dataSource={personas}
        pagination={{
          current: currentPage,
          pageSize,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
          onChange: (page, nextPageSize) => {
            setCurrentPage(page);
            setPageSize(nextPageSize);
          },
        }}
      />
    </Card>
  );
}
