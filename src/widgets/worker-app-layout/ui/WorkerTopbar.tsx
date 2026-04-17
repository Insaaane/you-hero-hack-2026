import type { ReactNode } from "react";
import {
  LeftOutlined,
  MenuUnfoldOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
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
  onOpenQrScanner: () => void;
  showQrScannerAction?: boolean;
};

export function WorkerTopbar({
  title,
  hasScrolled,
  rightAction,
  onBack,
  onOpenMenu,
  onOpenQrScanner,
  showQrScannerAction = true,
}: WorkerTopbarProps) {
  const customAction = rightAction ? (
    <Button
      type="text"
      danger={rightAction.danger}
      className={`worker-topbar__button ${rightAction.className ?? ""}`}
      aria-label={rightAction.ariaLabel}
      icon={rightAction.icon}
      size="large"
      onClick={rightAction.onClick}
    />
  ) : null;

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

      <Flex
        align="center"
        justify="flex-end"
        className="worker-topbar__actions"
      >
        {customAction}

        {showQrScannerAction && (
          <Button
            type="text"
            className="worker-topbar__button"
            aria-label="Сканировать QR-код"
            icon={<QrcodeOutlined />}
            onClick={onOpenQrScanner}
          />
        )}

        <Button
          type="text"
          className="worker-topbar__button"
          aria-label="Открыть меню"
          icon={<MenuUnfoldOutlined />}
          onClick={onOpenMenu}
        />
      </Flex>
    </Flex>
  );
}
