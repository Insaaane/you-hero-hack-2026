import { Drawer, Flex } from "antd";
import { RoleSwitcher } from "@/features/role-switcher";

type WorkerNavigationDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function WorkerNavigationDrawer({
  open,
  onClose,
}: WorkerNavigationDrawerProps) {
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
      </Flex>
    </Drawer>
  );
}
