import { Button, Modal, Table } from 'antd';

import type { Expediente } from '../types/Expediente';

type PersonaAsociada = {
  dni: string;
  apellido: string;
  nombre: string;
  tipoVinculoDescripcion: string;
};

type ExpedientePersonasModalProps = {
  expediente: Expediente | null;
  personas: PersonaAsociada[];
  isLoading: boolean;
  onClose: () => void;
  onEditPersonas?: (expediente: Expediente) => void;
};

export function ExpedientePersonasModal({
  expediente,
  personas,
  isLoading,
  onClose,
  onEditPersonas,
}: ExpedientePersonasModalProps) {
  return (
    <Modal
      className="dark-modal"
      title={expediente ? `Personas asociadas - ${expediente.clave}` : 'Personas asociadas'}
      open={expediente !== null}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {expediente && onEditPersonas && (
        <div style={{ marginBottom: 16, textAlign: 'right' }}>
          <Button type="primary" onClick={() => onEditPersonas(expediente)}>
            Editar personas
          </Button>
        </div>
      )}
      <Table
        className="large-table"
        rowKey="dni"
        loading={isLoading}
        dataSource={personas}
        pagination={false}
        columns={[
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
        ]}
      />
    </Modal>
  );
}
