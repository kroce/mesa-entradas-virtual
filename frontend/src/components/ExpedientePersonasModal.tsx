import { Modal, Table } from 'antd';

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
};

export function ExpedientePersonasModal({
  expediente,
  personas,
  isLoading,
  onClose,
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
