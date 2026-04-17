import type { ReactNode } from "react";
import { AppstoreOutlined, LeftOutlined } from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";

export type WorkerTopbarAction = {
  ariaLabel: string;
  icon: ReactNode;
  className?: string;
  danger?: boolean;
  onClick: () => void;
};

type WorkerTopbarProps = {
  title: string;
  hasScrolled: boolean;
  rightAction?: WorkerTopbarAction | null;
  onBack: () => void;
  onOpenMenu: () => void;
};

export function WorkerTopbar({
  title,
  hasScrolled,
  rightAction,
  onBack,
  onOpenMenu,
}: WorkerTopbarProps) {
  const rightControl =
    rightAction === undefined ? (
      <Button
        type="text"
        className="worker-topbar__button"
        aria-label="Открыть меню"
        icon={<AppstoreOutlined />}
        onClick={onOpenMenu}
      />
    ) : rightAction ? (
      <Button
        type="text"
        danger={rightAction.danger}
        className={`worker-topbar__button ${rightAction.className ?? ""}`}
        aria-label={rightAction.ariaLabel}
        icon={rightAction.icon}
        size="large"
        onClick={rightAction.onClick}
      />
    ) : (
      <span className="worker-topbar__spacer" aria-hidden="true" />
    );

  return (
    <Flex
      component="header"
      align="center"
      justify="space-between"
      className={`worker-topbar ${
        hasScrolled ? "worker-topbar--scrolled" : ""
      }`}
    >
      <Button
        type="text"
        className="worker-topbar__button"
        aria-label="Назад"
        icon={<LeftOutlined />}
        onClick={onBack}
      />

      <Typography.Text className="worker-topbar__title">
        {title}
      </Typography.Text>

      {rightControl}
    </Flex>
  );
}
