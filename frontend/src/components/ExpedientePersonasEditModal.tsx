import { Alert, Button, Form, Modal, Select, Space } from 'antd';
import type { Expediente, ExpedientePersona, ExpedientePersonaInput } from '../types/Expediente';
import type { Persona } from '../types/Persona';
import { updateExpedientePersonas } from '../api/expedientes';
import { useState } from 'react';

type ExpedientePersonasEditModalProps = {
  expediente: Expediente | null;
  personasAsociadas: ExpedientePersona[];
  personasDisponibles: Persona[];
  onClose: () => void;
  onUpdated: (personas: ExpedientePersona[]) => void;
};

type ExpedientePersonasEditFormValues = {
  actorDni: string;
  personas?: ExpedientePersonaInput[];
};

const ACTOR_VINCULO_ID = 1;

const vinculoOptions = [
  { value: 2, label: 'DEMANDADO' },
  { value: 3, label: 'CONDENADO' },
  { value: 4, label: 'VICTIMA' },
];

export function ExpedientePersonasEditModal({
  expediente,
  personasAsociadas,
  personasDisponibles,
  onClose,
  onUpdated,
}: ExpedientePersonasEditModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!expediente) {
    return null;
  }

  const currentExpediente = expediente;

  const actor = personasAsociadas.find((persona) => persona.tipoVinculoId === ACTOR_VINCULO_ID);

  const personasVinculadas = personasAsociadas
    .filter((persona) => persona.tipoVinculoId !== ACTOR_VINCULO_ID)
    .map((persona) => ({
      personaDni: persona.dni,
      tipoVinculoId: persona.tipoVinculoId,
    }));

  async function handleFinish(values: ExpedientePersonasEditFormValues) {
    const personasVinculadas = values.personas ?? [];

    const input = {
      personas: [
        {
          personaDni: values.actorDni,
          tipoVinculoId: ACTOR_VINCULO_ID,
        },
        ...personasVinculadas,
      ],
    };

    setIsUpdating(true);
    setError(null);

    try {
      const updatedPersonas = await updateExpedientePersonas(currentExpediente.clave, input);
      onUpdated(updatedPersonas);
    } catch {
      setError('No se pudieron actualizar las personas del expediente.');
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Modal
      title={`Editar personas - ${currentExpediente.clave}`}
      open
      onCancel={onClose}
      footer={null}
      width={900}
    >
      {error && <Alert type="error" title={error} showIcon style={{ marginBottom: 16 }} />}

      <Form
        layout="vertical"
        onFinish={(values) => void handleFinish(values)}
        initialValues={{
          actorDni: actor?.dni,
          personas: personasVinculadas,
        }}
      >
        <Form.Item
          label="Actor principal"
          name="actorDni"
          rules={[{ required: true, message: 'Seleccioná el actor principal' }]}
        >
          <Select
            showSearch={{ optionFilterProp: 'label' }}
            placeholder="Buscar por DNI, apellido o nombre"
            options={personasDisponibles.map((persona) => ({
              value: persona.dni,
              label: `${persona.dni} - ${persona.apellido}, ${persona.nombre}`,
            }))}
          />
        </Form.Item>

        <Form.List name="personas">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline" wrap>
                  <Form.Item
                    {...restField}
                    label="Persona vinculada"
                    name={[name, 'personaDni']}
                    rules={[{ required: true, message: 'Seleccioná una persona' }]}
                  >
                    <Select
                      showSearch={{ optionFilterProp: 'label' }}
                      style={{ width: 280 }}
                      placeholder="Buscar persona"
                      options={personasDisponibles.map((persona) => ({
                        value: persona.dni,
                        label: `${persona.dni} - ${persona.apellido}, ${persona.nombre}`,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    label="Vínculo"
                    name={[name, 'tipoVinculoId']}
                    rules={[{ required: true, message: 'Seleccioná un vínculo' }]}
                  >
                    <Select style={{ width: 180 }} placeholder="Vínculo" options={vinculoOptions} />
                  </Form.Item>

                  <Form.Item label=" " colon={false}>
                    <Button danger onClick={() => remove(name)}>
                      Quitar
                    </Button>
                  </Form.Item>
                </Space>
              ))}

              <Form.Item>
                <Button type="dashed" onClick={() => add()}>
                  Agregar persona vinculada
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Space>
          <Button type="primary" htmlType="submit" loading={isUpdating}>
            Guardar personas
          </Button>

          <Button onClick={onClose}>Cancelar</Button>
        </Space>
      </Form>
    </Modal>
  );
}
