import { AppstoreOutlined, LeftOutlined } from '@ant-design/icons'
import { Button, Flex, Typography } from 'antd'

type WorkerTopbarProps = {
  title: string
  hasScrolled: boolean
  onBack: () => void
  onOpenMenu: () => void
}

export function WorkerTopbar({
  title,
  hasScrolled,
  onBack,
  onOpenMenu,
}: WorkerTopbarProps) {
  return (
    <Flex
      component="header"
      align="center"
      justify="space-between"
      className={`worker-topbar ${
        hasScrolled ? 'worker-topbar--scrolled' : ''
      }`}
    >
      <Button
        type="text"
        className="worker-topbar__button"
        aria-label="Назад"
        icon={<LeftOutlined />}
        onClick={onBack}
      />

      <Typography.Text className="worker-topbar__title">{title}</Typography.Text>

      <Button
        type="text"
        className="worker-topbar__button"
        aria-label="Открыть меню"
        icon={<AppstoreOutlined />}
        onClick={onOpenMenu}
      />
    </Flex>
  )
}
