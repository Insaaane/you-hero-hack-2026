import { useEffect, useState } from "react";
import { Alert } from "antd";
import { useLocation, useNavigate } from "react-router";
import { useIsPageBottomReached } from "@/shared/lib/viewport";
import { inspectionRequest } from "../model/mockInspectionRequest";
import { InspectionBottomAction } from "./InspectionBottomAction";
import { InspectionSummaryCard } from "./InspectionSummaryCard";
import { InspectionTasksSection } from "./InspectionTasksSection";

type InspectionRouteState = {
  taskCompleted?: boolean;
  maintenanceRequestSent?: boolean;
  maintenanceTaskTitle?: string;
} | null;

type InspectionAlertContent = {
  title: string;
  description: string;
};

function getInspectionAlertContent(
  state: InspectionRouteState,
): InspectionAlertContent | null {
  if (state?.maintenanceRequestSent) {
    return {
      title: "Заявка отправлена",
      description: `Отправлена заявка на обслуживание объекта: ${
        state.maintenanceTaskTitle ?? "объект обхода"
      }`,
    };
  }

  if (state?.taskCompleted) {
    return {
      title: "Задача завершена",
      description: "Показатели соответствуют референсным значениям",
    };
  }

  return null;
}

export function WorkerInspectionRequestPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isPageBottomReached = useIsPageBottomReached();
  const [inspectionAlert, setInspectionAlert] = useState(() =>
    getInspectionAlertContent(location.state as InspectionRouteState),
  );

  const openTask = (taskId: string) => {
    navigate(`/inspector/tasks/${taskId}`);
  };

  useEffect(() => {
    if (!getInspectionAlertContent(location.state as InspectionRouteState)) {
      return;
    }

    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!inspectionAlert) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setInspectionAlert(null);
    }, 5000);

    return () => window.clearTimeout(timerId);
  }, [inspectionAlert]);

  return (
    <main className="inspection-request-page">
      {inspectionAlert && (
        <Alert
          type="success"
          showIcon
          closable={{
            closeIcon: true,
            onClose: () => setInspectionAlert(null),
            "aria-label": "close",
          }}
          className="inspection-completion-alert"
          title={inspectionAlert.title}
          description={inspectionAlert.description}
        />
      )}

      <InspectionSummaryCard
        reason={inspectionRequest.reason}
        date={inspectionRequest.date}
        time={inspectionRequest.time}
        completedTasks={inspectionRequest.completedTasks}
        totalTasks={inspectionRequest.totalTasks}
      />

      <InspectionTasksSection
        tasks={inspectionRequest.tasks}
        totalTasks={inspectionRequest.totalTasks}
        onOpenTask={openTask}
      />

      <InspectionBottomAction
        isPageBottomReached={isPageBottomReached}
        onGoToNextTask={() => openTask("task-1")}
      />
    </main>
  );
}
