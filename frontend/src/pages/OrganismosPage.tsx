import { Alert, Button, Card, Modal, Popconfirm, Space, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';

import {
  createOrganismo,
  deleteOrganismo,
  getOrganismos,
  updateOrganismo,
} from '../api/organismos';
import { OrganismoForm } from '../components/OrganismoForm';
import { useAutoClearMessage } from '../hooks/useAutoClearMessage';
import type { CreateOrganismoInput, Organismo, UpdateOrganismoInput } from '../types/Organismo';

const { Title } = Typography;

export function OrganismosPage() {
  const [organismos, setOrganismos] = useState<Organismo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingOrganismo, setEditingOrganismo] = useState<Organismo | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useAutoClearMessage(successMessage, setSuccessMessage);
  useAutoClearMessage(error, setError);

  useEffect(() => {
    let isMounted = true;

    getOrganismos()
      .then((data) => {
        if (isMounted) {
          setOrganismos(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('No se pudieron cargar los organismos');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleCreateOrganismo(values: CreateOrganismoInput): Promise<boolean> {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      const organismo = await createOrganismo(values);

      setOrganismos((currentOrganismos) => [...currentOrganismos, organismo]);
      setSuccessMessage(`Organismo ${organismo.codigo} creado correctamente.`);

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'No se pudo crear el organismo';

      setError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteOrganismo(codigo: string) {
    try {
      setError(null);
      setSuccessMessage(null);

      await deleteOrganismo(codigo);

      setOrganismos((currentOrganismos) =>
        currentOrganismos.filter((organismo) => organismo.codigo !== codigo),
      );
      setSuccessMessage(`Organismo ${codigo} eliminado correctamente.`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'No se pudo eliminar el organismo';

      setError(errorMessage);
    }
  }

  async function handleUpdateOrganismo(values: UpdateOrganismoInput) {
    if (!editingOrganismo) {
      return;
    }

    try {
      setIsUpdating(true);
      setError(null);
      setSuccessMessage(null);

      const updatedOrganismo = await updateOrganismo(editingOrganismo.codigo, values);

      setOrganismos((currentOrganismos) =>
        currentOrganismos.map((organismo) =>
          organismo.codigo === updatedOrganismo.codigo ? updatedOrganismo : organismo,
        ),
      );

      setSuccessMessage(`Organismo ${updatedOrganismo.codigo} actualizado correctamente.`);
      setEditingOrganismo(null);
    } catch {
      setError('No se pudo actualizar el organismo');
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <>
      {error && <Alert type="error" title={error} showIcon />}

      {successMessage && (
        <Alert
          type="success"
          title={successMessage}
          showIcon
          closable={{
            onClose: () => setSuccessMessage(null),
          }}
        />
      )}

      <Card style={{ marginBottom: 24 }}>
        <Title level={2}>Nuevo organismo</Title>

        <div className="form-container">
          <OrganismoForm onSubmit={handleCreateOrganismo} isSubmitting={isSubmitting} />
        </div>
      </Card>

      <Table
        className="large-table"
        rowKey="codigo"
        loading={isLoading}
        dataSource={organismos}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
        }}
        columns={[
          {
            title: 'Código',
            dataIndex: 'codigo',
          },
          {
            title: 'Nombre',
            dataIndex: 'nombre',
          },
          {
            title: 'Carátula',
            dataIndex: 'caratula',
          },
          {
            title: 'Ciudad',
            dataIndex: 'ciudadNombre',
            key: 'ciudadNombre',
          },
          {
            title: 'Fuero',
            dataIndex: 'fueroNombre',
            key: 'fueroNombre',
          },
          {
            title: 'Acciones',
            key: 'actions',
            render: (_, organismo: Organismo) => (
              <Space>
                <Button onClick={() => setEditingOrganismo(organismo)}>Editar</Button>

                <Popconfirm
                  title="Eliminar organismo"
                  description="¿Confirmás que querés eliminar este organismo?"
                  okText="Sí"
                  cancelText="No"
                  onConfirm={() => void handleDeleteOrganismo(organismo.codigo)}
                >
                  <Button danger>Eliminar</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
      <Modal
        title="Editar organismo"
        open={editingOrganismo !== null}
        onCancel={() => setEditingOrganismo(null)}
        footer={null}
      >
        {editingOrganismo && (
          <OrganismoForm
            key={editingOrganismo.codigo}
            initialValues={{
              nombre: editingOrganismo.nombre,
              caratula: editingOrganismo.caratula,
              ciudadCodigo: editingOrganismo.ciudadCodigo,
              fueroCodigo: editingOrganismo.fueroCodigo,
            }}
            onSubmit={handleUpdateOrganismo}
            isSubmitting={isUpdating}
            submitLabel="Guardar cambios"
          />
        )}
      </Modal>
    </>
  );
}
