import {
  CameraOutlined,
  CheckSquareOutlined,
  DashboardOutlined,
  FieldTimeOutlined,
  OrderedListOutlined,
  PartitionOutlined,
} from '@ant-design/icons'
import { getInspectionTaskById } from '@/entities/inspection'

export const inspectionRequestPath = '/inspector/rounds/1488228'

export const workerNavigationItems = [
  {
    path: inspectionRequestPath,
    label: 'Заявка на обход',
    icon: <OrderedListOutlined />,
  },
  {
    path: '/inspector/route',
    label: 'Маршрут',
    icon: <PartitionOutlined />,
  },
  {
    path: '/inspector/tasks',
    label: 'Все задачи',
    icon: <CheckSquareOutlined />,
  },
  {
    path: '/inspector/checklists',
    label: 'Чек-листы',
    icon: <FieldTimeOutlined />,
  },
  {
    path: '/inspector/readings',
    label: 'Показания',
    icon: <DashboardOutlined />,
  },
  {
    path: '/inspector/photo',
    label: 'Фотофиксация',
    icon: <CameraOutlined />,
  },
]

export function getWorkerRouteTitle(pathname: string) {
  const taskId = pathname.match(
    /^\/inspector\/rounds\/[^/]+\/tasks\/([^/]+)/,
  )?.[1]

  if (taskId) {
    return getInspectionTaskById(taskId)?.title ?? 'Задача'
  }

  const roundId = pathname.match(/^\/inspector\/rounds\/([^/]+)/)?.[1]

  if (roundId) {
    return `Обход ${roundId}`
  }

  if (pathname === '/inspector/qr-scanner') {
    return 'QR-сканер'
  }

  const currentItem = workerNavigationItems.find(
    (item) => item.path === pathname,
  )

  return currentItem?.label ?? 'Мобильный обходчик'
}
