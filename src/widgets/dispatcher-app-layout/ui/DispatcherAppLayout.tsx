import { useEffect } from 'react'
import { Card, Layout, Space, Typography } from 'antd'
import { Outlet } from 'react-router'
import { setCurrentRole } from '@/app/model/sessionSlice'
import { RoleSwitcher } from '@/features/role-switcher'
import { useAppDispatch } from '@/shared/lib/store'

const { Content } = Layout

export function DispatcherAppLayout() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setCurrentRole('dispatcher'))
  }, [dispatch])

  return (
    <Layout className="dispatcher-shell">
      <Content className="dispatcher-shell__content">
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <Card>
            <Space orientation="vertical" size={8} style={{ width: '100%' }}>
              <Typography.Title level={2} style={{ margin: 0 }}>
                Рабочее место диспетчера
              </Typography.Title>
              <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
                Временная заглушка роли. После подключения авторизации роль будет
                приходить из профиля пользователя.
              </Typography.Paragraph>
              <RoleSwitcher />
            </Space>
          </Card>

          <Outlet />
        </Space>
      </Content>
    </Layout>
  )
}
