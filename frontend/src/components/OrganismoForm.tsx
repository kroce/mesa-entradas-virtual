import { Button, Form, Input, Select } from 'antd';

import type { CreateOrganismoInput } from '../types/Organismo';

type OrganismoFormProps = {
  onSubmit: (values: CreateOrganismoInput) => void;
  isSubmitting?: boolean;
};

export function OrganismoForm({ onSubmit, isSubmitting = false }: OrganismoFormProps) {
  return (
    <Form<CreateOrganismoInput> layout="vertical" onFinish={onSubmit}>
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
        name="ciudad"
        rules={[{ required: true, message: 'La ciudad es obligatoria' }]}
      >
        <Select
          options={[
            { label: 'Neuquén', value: 'Neuquén' },
            { label: 'Zapala', value: 'Zapala' },
            { label: 'Junín de los Andes', value: 'Junín de los Andes' },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="Fuero"
        name="fuero"
        rules={[{ required: true, message: 'El fuero es obligatorio' }]}
      >
        <Select
          options={[
            { label: 'Ejecutivos', value: 'Ejecutivos' },
            { label: 'Civil', value: 'Civil' },
            { label: 'Laboral', value: 'Laboral' },
            { label: 'Familia', value: 'Familia' },
          ]}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={isSubmitting}>
        Crear organismo
      </Button>
    </Form>
  );
}
