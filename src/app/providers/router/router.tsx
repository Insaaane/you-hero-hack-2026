import { createBrowserRouter, Navigate } from "react-router";
import { IncidentPhotoCapture } from "@/features/incident-photo-capture";
import { DispatcherPlaceholderPage } from "@/pages/dispatcher-placeholder";
import { DispatcherRoundFormPage } from "@/pages/dispatcher-round-form";
import { DispatcherRoundsPage } from "@/pages/dispatcher-rounds";
import { PlaceholderPage } from "@/pages/placeholder";
import { WorkerInspectionRequestPage } from "@/pages/worker-inspection-request";
import { WorkerQrScannerPage } from "@/pages/worker-qr-scanner";
import { WorkerRoundsPage } from "@/pages/worker-rounds";
import { WorkerTaskDetailsPage } from "@/pages/worker-task-details";
import { DispatcherAppLayout } from "@/widgets/dispatcher-app-layout";
import { WorkerAppLayout } from "@/widgets/worker-app-layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/inspector/rounds" replace />,
  },
  {
    path: "/inspector",
    element: <WorkerAppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/inspector/rounds" replace />,
      },
      {
        path: "rounds",
        element: <WorkerRoundsPage />,
      },
      {
        path: "rounds/:roundId",
        element: <WorkerInspectionRequestPage />,
      },
      {
        path: "rounds/:roundId/tasks/:taskId",
        element: <WorkerTaskDetailsPage />,
      },
      {
        path: "qr-scanner",
        element: <WorkerQrScannerPage />,
      },
      {
        path: "tasks",
        element: <Navigate to="/inspector/rounds" replace />,
      },
      {
        path: "route",
        element: (
          <PlaceholderPage
            title="Маршрут обхода"
            description="Здесь появится последовательность объектов и навигация по маршруту."
          />
        ),
      },
      {
        path: "checklists",
        element: (
          <PlaceholderPage
            title="Чек-листы"
            description="Здесь появятся регламентные проверки оборудования."
          />
        ),
      },
      {
        path: "readings",
        element: (
          <PlaceholderPage
            title="Показания"
            description="Здесь появится быстрый ввод параметров оборудования."
          />
        ),
      },
      {
        path: "photo",
        element: (
          <main className="placeholder-page">
            <IncidentPhotoCapture />
          </main>
        ),
      },
    ],
  },
  {
    path: "/dispatcher",
    element: <DispatcherAppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dispatcher/rounds" replace />,
      },
      {
        path: "rounds",
        element: <DispatcherRoundsPage />,
      },
      {
        path: "rounds/new",
        element: <DispatcherRoundFormPage />,
      },
      {
        path: "rounds/:roundId/edit",
        element: <DispatcherRoundFormPage />,
      },
      {
        path: "maintenance",
        element: (
          <DispatcherPlaceholderPage
            title="Заявки на техобслуживание"
            description="Здесь появится список заявок на обслуживание объектов."
          />
        ),
      },
      {
        path: "locations",
        element: (
          <DispatcherPlaceholderPage
            title="Локации"
            description="Здесь появится управление цехами, участками и маршрутами."
          />
        ),
      },
      {
        path: "equipment",
        element: (
          <DispatcherPlaceholderPage
            title="Оборудование"
            description="Здесь появится каталог оборудования для обходов."
          />
        ),
      },
      {
        path: "employees",
        element: (
          <DispatcherPlaceholderPage
            title="Сотрудники"
            description="Здесь появится список обходчиков и диспетчеров."
          />
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
