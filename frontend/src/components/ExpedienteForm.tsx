import { Button, Form, Input, InputNumber, Select, Space } from 'antd';

import type {
  CreateExpedienteInput,
  ExpedientePersonaInput,
  ExpedienteTipo,
} from '../types/Expediente';
import type { Organismo } from '../types/Organismo';
import type { Persona } from '../types/Persona';

type ExpedienteFormValues = {
  organismoCodigo: string;
  tipo: ExpedienteTipo;
  numero: number;
  anio: number;
  caratula: string;
  actorDni: string;
  personas?: ExpedientePersonaInput[];
};

type ExpedienteFormProps = {
  organismos: Organismo[];
  personas: Persona[];
  isSubmitting?: boolean;
  onSubmit: (input: CreateExpedienteInput) => Promise<void> | void;
};

const ACTOR_VINCULO_ID = 1;

const vinculoOptions = [
  { value: 2, label: 'DEMANDADO' },
  { value: 3, label: 'CONDENADO' },
  { value: 4, label: 'VICTIMA' },
];

export function ExpedienteForm({
  organismos,
  personas,
  isSubmitting = false,
  onSubmit,
}: ExpedienteFormProps) {
  const [form] = Form.useForm<ExpedienteFormValues>();

  async function handleFinish(values: ExpedienteFormValues) {
    const organismo = organismos.find(
      (currentOrganismo) => currentOrganismo.codigo === values.organismoCodigo,
    );

    if (!organismo) {
      return;
    }

    const personasVinculadas = (values.personas ?? []).filter(
      (persona) => persona.personaDni && persona.tipoVinculoId,
    );

    const input: CreateExpedienteInput = {
      organismoCodigo: values.organismoCodigo,
      tipo: values.tipo,
      numero: values.numero,
      anio: values.anio,
      caratula: values.caratula,
      ciudadCodigo: organismo.ciudadCodigo,
      personas: [
        {
          personaDni: values.actorDni,
          tipoVinculoId: ACTOR_VINCULO_ID,
        },
        ...personasVinculadas,
      ],
    };

    await onSubmit(input);
    form.resetFields();
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => void handleFinish(values)}
      initialValues={{
        tipo: 'EXP',
        anio: new Date().getFullYear(),
        personas: [],
      }}
    >
      <Form.Item
        label="Organismo"
        name="organismoCodigo"
        rules={[{ required: true, message: 'Seleccioná un organismo' }]}
      >
        <Select
          placeholder="Seleccionar organismo"
          options={organismos.map((organismo) => ({
            value: organismo.codigo,
            label: `${organismo.codigo} - ${organismo.nombre}`,
          }))}
        />
      </Form.Item>

      <div className="expediente-row">
        <Form.Item
          label="Tipo"
          name="tipo"
          rules={[{ required: true, message: 'Seleccioná un tipo' }]}
        >
          <Select
            options={[
              { value: 'EXP', label: 'EXP' },
              { value: 'LEG', label: 'LEG' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Número"
          name="numero"
          rules={[{ required: true, message: 'Ingresá un número' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Año" name="anio" rules={[{ required: true, message: 'Ingresá un año' }]}>
          <InputNumber min={2000} style={{ width: '100%' }} />
        </Form.Item>
      </div>

      <Form.Item
        label="Carátula"
        name="caratula"
        rules={[{ required: true, message: 'Ingresá la carátula' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Actor principal"
        name="actorDni"
        rules={[{ required: true, message: 'Seleccioná el actor principal' }]}
      >
        <Select
          showSearch={{ optionFilterProp: 'label' }}
          placeholder="Buscar por DNI, apellido o nombre"
          options={personas.map((persona) => ({
            value: persona.dni,
            label: `${persona.dni} - ${persona.apellido}, ${persona.nombre}`,
          }))}
        />
      </Form.Item>
      <div style={{ marginTop: 8 }}>
        <Form.List name="personas">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  align="baseline"
                  wrap
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                  }}
                >
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
                      options={personas.map((persona) => ({
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

              <Form.Item style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    width: '100%',
                  }}
                >
                  <Button type="dashed" htmlType="button" onClick={() => add()}>
                    Agregar persona vinculada
                  </Button>
                </div>
              </Form.Item>
            </>
          )}
        </Form.List>
      </div>

      <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          Crear expediente
        </Button>
      </Form.Item>
    </Form>
  );
}
