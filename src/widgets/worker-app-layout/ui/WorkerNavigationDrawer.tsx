import { Drawer, Flex, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { RoleSwitcher } from '@/features/role-switcher'
import { workerNavigationItems } from '../model/navigation'

type WorkerNavigationDrawerProps = {
  open: boolean
  selectedPath: string
  onClose: () => void
  onNavigate: (path: string) => void
}

export function WorkerNavigationDrawer({
  open,
  selectedPath,
  onClose,
  onNavigate,
}: WorkerNavigationDrawerProps) {
  const handleNavigate: MenuProps['onClick'] = ({ key }) => {
    onNavigate(key)
  }

  return (
    <Drawer
      title="Меню"
      placement="right"
      size={320}
      open={open}
      onClose={onClose}
    >
      <Flex vertical gap={20}>
        <RoleSwitcher />

        <Menu
          mode="inline"
          selectedKeys={[selectedPath]}
          items={workerNavigationItems.map((item) => ({
            key: item.path,
            label: item.label,
            icon: item.icon,
          }))}
          onClick={handleNavigate}
        />
      </Flex>
    </Drawer>
  )
}
