import { useEffect, useState } from "react";
import { Alert, Card, Empty, Spin } from "antd";
import { useLocation, useNavigate, useParams } from "react-router";
import {
  type InspectionTask,
  useGetRoundQuery,
  useGetTasksByRoundQuery,
} from "@/entities/inspection";
import { useIsPageBottomReached } from "@/shared/lib/viewport";
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

function sortTasksByNextMarker(tasks: InspectionTask[]) {
  return [...tasks].sort((firstTask, secondTask) => {
    const isFirstTaskNext =
      firstTask.status === "pending" && Boolean(firstTask.marker);
    const isSecondTaskNext =
      secondTask.status === "pending" && Boolean(secondTask.marker);

    if (isFirstTaskNext && !isSecondTaskNext) {
      return -1;
    }

    if (!isFirstTaskNext && isSecondTaskNext) {
      return 1;
    }

    return 0;
  });
}

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
  const { roundId = "12345" } = useParams();
  const isPageBottomReached = useIsPageBottomReached();
  const {
    data: inspectionRound,
    isLoading: isRoundLoading,
    isError: isRoundError,
  } = useGetRoundQuery(roundId);
  const {
    data: inspectionTasks = [],
    isLoading: isTasksLoading,
    isError: isTasksError,
  } = useGetTasksByRoundQuery(roundId);
  const [inspectionAlert, setInspectionAlert] = useState(() =>
    getInspectionAlertContent(location.state as InspectionRouteState),
  );
  const isLoading = isRoundLoading || isTasksLoading;
  const isError = isRoundError || isTasksError;
  const sortedInspectionTasks = sortTasksByNextMarker(inspectionTasks);
  const totalTasks = sortedInspectionTasks.length;
  const completedTasks = sortedInspectionTasks.filter(
    (task) => task.status !== "pending",
  ).length;
  const nextTask =
    sortedInspectionTasks.find(
      (task) => task.status === "pending" && task.marker,
    ) ??
    sortedInspectionTasks.find((task) => task.status === "pending");

  const openTask = (taskId: string) => {
    navigate(`/inspector/rounds/${roundId}/tasks/${taskId}`);
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

      {isLoading && (
        <Card style={{display: "flex", justifyContent: "center"}}>
          <Spin tip="Загружаем обход" />
        </Card>
      )}

      {!isLoading && isError && (
        <Card>
          <Empty description="Не удалось загрузить данные обхода" />
        </Card>
      )}

      {!isLoading && !isError && inspectionRound && (
        <>
          <InspectionSummaryCard
            reason={inspectionRound.reason}
            date={inspectionRound.date}
            time={inspectionRound.time}
            completedTasks={completedTasks}
            totalTasks={Math.max(totalTasks, inspectionRound.totalTasks)}
          />

          <InspectionTasksSection
            tasks={sortedInspectionTasks}
            totalTasks={sortedInspectionTasks.length}
            onOpenTask={openTask}
          />

          {nextTask && (
            <InspectionBottomAction
              isPageBottomReached={isPageBottomReached}
              onGoToNextTask={() => openTask(nextTask.id)}
            />
          )}
        </>
      )}
    </main>
  );
}
