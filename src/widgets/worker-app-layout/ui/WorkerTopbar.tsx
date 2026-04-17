import type { CSSProperties, ReactNode } from "react";
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
  const rightButtonCount =
    1 + (showQrScannerAction ? 1 : 0) + (rightAction ? 1 : 0);
  const sideStyle = {
    "--worker-topbar-side-width": `${rightButtonCount * 44}px`,
  } as CSSProperties;
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
      <Flex align="center" className="worker-topbar__side" style={sideStyle}>
        <Button
          type="text"
          className="worker-topbar__button"
          aria-label="Назад"
          icon={<LeftOutlined />}
          onClick={onBack}
        />
      </Flex>

      <Typography.Text className="worker-topbar__title">
        {title}
      </Typography.Text>

      <Flex
        align="center"
        justify="flex-end"
        className="worker-topbar__side worker-topbar__actions"
        style={sideStyle}
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
