import { Alert, Card, Table } from 'antd';
import { useEffect, useState } from 'react';

import { createOrganismo, getOrganismos } from '../api/organismos';
import { OrganismoForm } from '../components/OrganismoForm';
import type { CreateOrganismoInput, Organismo } from '../types/Organismo';

export function OrganismosPage() {
  const [organismos, setOrganismos] = useState<Organismo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function handleCreateOrganismo(values: CreateOrganismoInput) {
    try {
      setIsSubmitting(true);
      setError(null);

      const organismo = await createOrganismo(values);

      setOrganismos((currentOrganismos) => [...currentOrganismos, organismo]);
    } catch {
      setError('No se pudo crear el organismo');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {error && <Alert type="error" title={error} showIcon />}

      <Card title="Crear organismo" style={{ marginBottom: 24 }}>
        <OrganismoForm onSubmit={handleCreateOrganismo} isSubmitting={isSubmitting} />
      </Card>

      <Table
        rowKey="codigo"
        loading={isLoading}
        dataSource={organismos}
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
            dataIndex: 'ciudad',
          },
          {
            title: 'Fuero',
            dataIndex: 'fuero',
          },
        ]}
      />
    </>
  );
}
