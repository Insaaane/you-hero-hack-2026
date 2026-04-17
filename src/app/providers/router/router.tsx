import { createBrowserRouter, Navigate } from 'react-router'
import { IncidentPhotoCapture } from '@/features/incident-photo-capture'
import { PlaceholderPage } from '@/pages/placeholder'
import { WorkerInspectionRequestPage } from '@/pages/worker-inspection-request'
import { WorkerTaskDetailsPage } from '@/pages/worker-task-details'
import { DispatcherAppLayout } from '@/widgets/dispatcher-app-layout'
import { WorkerAppLayout } from '@/widgets/worker-app-layout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/inspector/rounds/1488228" replace />,
  },
  {
    path: '/inspector',
    element: <WorkerAppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/inspector/rounds/1488228" replace />,
      },
      {
        path: 'rounds/:inspectionId',
        element: <WorkerInspectionRequestPage />,
      },
      {
        path: 'route',
        element: (
          <PlaceholderPage
            title="Маршрут обхода"
            description="Здесь появится последовательность объектов и навигация по маршруту."
          />
        ),
      },
      {
        path: 'tasks',
        element: (
          <PlaceholderPage
            title="Все задачи"
            description="Здесь появится список задач обходчика по текущему обходу."
          />
        ),
      },
      {
        path: 'tasks/:taskId',
        element: <WorkerTaskDetailsPage />,
      },
      {
        path: 'checklists',
        element: (
          <PlaceholderPage
            title="Чек-листы"
            description="Здесь появятся регламентные проверки оборудования."
          />
        ),
      },
      {
        path: 'readings',
        element: (
          <PlaceholderPage
            title="Показания"
            description="Здесь появится быстрый ввод параметров оборудования."
          />
        ),
      },
      {
        path: 'photo',
        element: (
          <main className="placeholder-page">
            <IncidentPhotoCapture />
          </main>
        ),
      },
    ],
  },
  {
    path: '/dispatcher',
    element: <DispatcherAppLayout />,
    children: [
      {
        index: true,
        element: (
          <PlaceholderPage
            title="Панель диспетчера"
            description="Здесь появится контроль маршрутов, отклонений и статусов обходчиков."
          />
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
