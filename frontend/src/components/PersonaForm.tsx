import { Button, Form, Input } from 'antd';

export type PersonaFormValues = {
  dni: string;
  apellido: string;
  nombre: string;
};

type PersonaFormProps = {
  initialValues?: PersonaFormValues;
  isDniDisabled?: boolean;
  isSubmitting?: boolean;
  submitLabel?: string;
  resetAfterSubmit?: boolean;
  onSubmit: (input: PersonaFormValues) => Promise<void> | void;
};

export function PersonaForm({
  initialValues,
  isDniDisabled = false,
  isSubmitting = false,
  submitLabel = 'Crear persona',
  resetAfterSubmit = true,
  onSubmit,
}: PersonaFormProps) {
  const [form] = Form.useForm<PersonaFormValues>();

  async function handleFinish(values: PersonaFormValues) {
    await onSubmit({
      dni: values.dni.trim(),
      apellido: values.apellido.trim(),
      nombre: values.nombre.trim(),
    });

    if (resetAfterSubmit) {
      form.resetFields();
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={(values) => void handleFinish(values)}
    >
      <Form.Item label="DNI" name="dni" rules={[{ required: true, message: 'Ingresá el DNI' }]}>
        <Input disabled={isDniDisabled} />
      </Form.Item>

      <Form.Item
        label="Apellido"
        name="apellido"
        rules={[{ required: true, message: 'Ingresá el apellido' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Nombre"
        name="nombre"
        rules={[{ required: true, message: 'Ingresá el nombre' }]}
      >
        <Input />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={isSubmitting}>
        {submitLabel}
      </Button>
    </Form>
  );
}
