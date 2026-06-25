import { useState } from 'react';
import { Alert, Input, Modal } from 'antd';

import { updateExpediente } from '../api/expedientes';
import type { Expediente } from '../types/Expediente';

type ExpedienteEditModalProps = {
  expediente: Expediente | null;
  onClose: () => void;
  onUpdated: (expediente: Expediente) => void;
};

type ExpedienteEditModalContentProps = {
  expediente: Expediente;
  onClose: () => void;
  onUpdated: (expediente: Expediente) => void;
};

export function ExpedienteEditModal({ expediente, onClose, onUpdated }: ExpedienteEditModalProps) {
  if (!expediente) {
    return null;
  }

  return (
    <ExpedienteEditModalContent
      key={expediente.clave}
      expediente={expediente}
      onClose={onClose}
      onUpdated={onUpdated}
    />
  );
}

function ExpedienteEditModalContent({
  expediente,
  onClose,
  onUpdated,
}: ExpedienteEditModalContentProps) {
  const [caratula, setCaratula] = useState(expediente.caratula);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const trimmedCaratula = caratula.trim();

    if (!trimmedCaratula) {
      setError('La carátula es obligatoria.');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const updatedExpediente = await updateExpediente(expediente.clave, {
        caratula: trimmedCaratula,
      });

      onUpdated(updatedExpediente);
    } catch {
      setError('No se pudo actualizar el expediente.');
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Modal
      title={`Editar expediente ${expediente.clave}`}
      open
      okText="Guardar"
      cancelText="Cancelar"
      onOk={() => void handleSubmit()}
      onCancel={onClose}
      okButtonProps={{
        loading: isUpdating,
        disabled: !caratula.trim(),
      }}
      cancelButtonProps={{
        disabled: isUpdating,
      }}
    >
      {error && <Alert type="error" title={error} showIcon style={{ marginBottom: 16 }} />}

      <Input.TextArea
        value={caratula}
        onChange={(event) => setCaratula(event.target.value)}
        placeholder="Carátula"
        rows={3}
      />
    </Modal>
  );
}
