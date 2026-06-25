import { Button, Form, Input, Select } from 'antd';

import type { CreateOrganismoInput } from '../types/Organismo';

type OrganismoFormProps = {
  initialValues?: Partial<CreateOrganismoInput>;
  onSubmit: (values: CreateOrganismoInput) => void | Promise<void> | boolean | Promise<boolean>;
  isSubmitting?: boolean;
  submitLabel?: string;
};

export function OrganismoForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Crear organismo',
}: OrganismoFormProps) {
  const [form] = Form.useForm<CreateOrganismoInput>();

  async function handleFinish(values: CreateOrganismoInput) {
    const wasSuccessful = await onSubmit(values);

    if (!initialValues && wasSuccessful !== false) {
      form.resetFields();
    }
  }
  return (
    <Form<CreateOrganismoInput>
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleFinish}
    >
      <Form.Item
        label="Nombre"
        name="nombre"
        rules={[{ required: true, message: 'El nombre es obligatorio' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Carátula"
        name="caratula"
        rules={[{ required: true, message: 'La carátula es obligatoria' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Ciudad"
        name="ciudadCodigo"
        rules={[{ required: true, message: 'La ciudad es obligatoria' }]}
      >
        <Select
          options={[
            { label: 'Neuquén', value: 'NQ' },
            { label: 'Zapala', value: 'ZA' },
            { label: 'Junín de los Andes', value: 'JU' },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="Fuero"
        name="fueroCodigo"
        rules={[{ required: true, message: 'El fuero es obligatorio' }]}
      >
        <Select
          options={[
            { label: 'Ejecutivos', value: 'EJ' },
            { label: 'Civil', value: 'CI' },
            { label: 'Laboral', value: 'LA' },
            { label: 'Familia', value: 'FA' },
          ]}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={isSubmitting}>
        {submitLabel}
      </Button>
    </Form>
  );
}
