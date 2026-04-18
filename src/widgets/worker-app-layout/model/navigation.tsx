import {
  CameraOutlined,
  CheckSquareOutlined,
  DashboardOutlined,
  FieldTimeOutlined,
  OrderedListOutlined,
  PartitionOutlined,
} from "@ant-design/icons";

export const inspectionRequestPath = "/inspector/rounds";

export const workerNavigationItems = [
  {
    path: inspectionRequestPath,
    label: "Заявка на обход",
    icon: <OrderedListOutlined />,
  },
  {
    path: "/inspector/route",
    label: "Маршрут",
    icon: <PartitionOutlined />,
  },
  {
    path: "/inspector/rounds",
    label: "Все обходы",
    icon: <CheckSquareOutlined />,
  },
  {
    path: "/inspector/checklists",
    label: "Чек-листы",
    icon: <FieldTimeOutlined />,
  },
  {
    path: "/inspector/readings",
    label: "Показания",
    icon: <DashboardOutlined />,
  },
  {
    path: "/inspector/photo",
    label: "Фотофиксация",
    icon: <CameraOutlined />,
  },
];

export function getWorkerRouteTitle(pathname: string) {
  if (/^\/inspector\/rounds\/[^/]+\/tasks\/[^/]+/.test(pathname)) {
    return "Задача";
  }

  const roundId = pathname.match(/^\/inspector\/rounds\/([^/]+)/)?.[1];

  if (roundId) {
    return `Обход ${roundId}`;
  }

  if (pathname === "/inspector/qr-scanner") {
    return "QR-сканер";
  }

  const currentItem = workerNavigationItems.find(
    (item) => item.path === pathname,
  );

  return currentItem?.label ?? "Мобильный обходчик";
}
