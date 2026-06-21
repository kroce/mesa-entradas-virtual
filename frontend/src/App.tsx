import { Layout, Typography } from 'antd';
import { OrganismosPage } from './pages/OrganismosPage';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Mesa de Entradas Virtual
        </Title>
      </Header>

      <Content style={{ padding: 24 }}>
        <OrganismosPage />
      </Content>
    </Layout>
  );
}

export default App;
