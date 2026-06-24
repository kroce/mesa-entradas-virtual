import { Tabs, Typography } from 'antd';
import { EstadisticasPage } from './pages/EstadisticasPage';
import { ExpedientesPage } from './pages/ExpedientesPage';
import { OrganismosPage } from './pages/OrganismosPage';
import { PersonasPage } from './pages/PersonasPage';
import './App.css';

const { Title } = Typography;

function App() {
  return (
    <>
      <header
        style={{
          backgroundColor: '#1f2937',
          padding: '28px 32px',
          marginBottom: 24,
        }}
      >
        <Title
          level={1}
          style={{
            color: '#ffffff',
            margin: 0,
            fontSize: 40,
            lineHeight: 1.2,
          }}
        >
          Mesa de Entradas Virtual
        </Title>
      </header>

      <main style={{ padding: '0 24px 24px' }}>
        <Tabs
          defaultActiveKey="expedientes"
          items={[
            {
              key: 'expedientes',
              label: 'Expedientes',
              children: <ExpedientesPage />,
            },
            {
              key: 'organismos',
              label: 'Organismos',
              children: <OrganismosPage />,
            },
            {
              key: 'personas',
              label: 'Personas',
              children: <PersonasPage />,
            },
            {
              key: 'estadisticas',
              label: 'Estadísticas',
              children: <EstadisticasPage />,
            },
          ]}
        />
      </main>
    </>
  );
}

export default App;
