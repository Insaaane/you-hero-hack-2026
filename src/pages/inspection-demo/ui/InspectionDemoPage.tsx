import { Card, Col, Layout, Row, Space, Tag, Typography } from 'antd'
import { IncidentPhotoCapture } from '@/features/incident-photo-capture'

const { Content } = Layout
const { Paragraph, Title } = Typography

const futureModules = [
  'Маршрут обхода',
  'Чек-листы оборудования',
  'Быстрый ввод показаний',
  'Офлайн-синхронизация',
]

export function InspectionDemoPage() {
  return (
    <Layout className="app-layout">
      <Content className="app-content">
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <Card>
            <Space orientation="vertical" size={8}>
              <Tag color="cyan">Кейс РМКД</Tag>
              <Title level={1} style={{ margin: 0 }}>
                Мобильный обходчик
              </Title>
              <Paragraph type="secondary" style={{ margin: 0 }}>
                Подготовка MVP для автоматизации обходов и осмотров
                оборудования энергоцеха: единое мобильное рабочее место для
                маршрутов, чек-листов, показаний, фотофиксации и последующей
                синхронизации с системами ТОиР.
              </Paragraph>
            </Space>
          </Card>

          <IncidentPhotoCapture />

          <Row gutter={[12, 12]}>
            {futureModules.map((moduleName) => (
              <Col xs={24} sm={12} key={moduleName}>
                <Card size="small">
                  <Typography.Text type="secondary">{moduleName}</Typography.Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Space>
      </Content>
    </Layout>
  )
}
