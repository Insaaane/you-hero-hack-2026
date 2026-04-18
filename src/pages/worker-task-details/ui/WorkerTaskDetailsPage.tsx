import { useCallback, useEffect, useMemo, useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  Empty,
  Flex,
  Form,
  Spin,
  Typography,
} from "antd";
import {
  Navigate,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router";
import {
  getReadingViolations,
  inspectionReadingConfigs,
  inspectionTaskStatusView,
  useGetRoundQuery,
  useGetTaskQuery,
  useGetTasksByRoundQuery,
  useUpdateRoundMutation,
  useUpdateTaskMutation,
  type InspectionDefectInfo,
  type InspectionReadingViolation,
  type InspectionTask,
  type InspectionTaskStatus,
} from "@/entities/inspection";
import { useIsPageBottomReached } from "@/shared/lib/viewport";
import type { WorkerOutletContext } from "@/widgets/worker-app-layout";
import {
  getReadingFormValues,
  getReadingsFromForm,
  parseReadingValue,
  type ReadingFormValues,
} from "../lib/readings";
import { TaskCriticalAlert } from "./TaskCriticalAlert";
import { TaskDeleteDefectConfirmModal } from "./TaskDeleteDefectConfirmModal";
import { TaskDeviationModal } from "./TaskDeviationModal";
import { TaskDefectFormModal } from "./TaskDefectFormModal";
import { TaskDefectSection } from "./TaskDefectSection";
import { TaskReadingsForm } from "./TaskReadingsForm";

type WorkerTaskDetailsContentProps = {
  task: InspectionTask;
};

type DefectFormMode = "add" | "edit";

type TaskSuccessAlert = {
  title: string;
};

function WorkerTaskDetailsContent({ task }: WorkerTaskDetailsContentProps) {
  const { setTopbarAction } = useOutletContext<WorkerOutletContext>();
  const navigate = useNavigate();
  const { roundId = "12345" } = useParams();
  const isPageBottomReached = useIsPageBottomReached();
  const { data: round } = useGetRoundQuery(roundId);
  const { data: roundTasks = [] } = useGetTasksByRoundQuery(roundId);
  const [updateRound] = useUpdateRoundMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [form] = Form.useForm<ReadingFormValues>();
  const initialFormValues = useMemo(
    () => getReadingFormValues(task.readings),
    [task.readings],
  );
  const [status, setStatus] = useState<InspectionTaskStatus>(task.status);
  const [isEditing, setIsEditing] = useState(task.status === "pending");
  const [defectInfos, setDefectInfos] = useState<InspectionDefectInfo[]>(
    () => task.defects ?? (task.defect ? [task.defect] : []),
  );
  const [activeDefectIndex, setActiveDefectIndex] = useState<number | null>(
    null,
  );
  const [violations, setViolations] = useState<InspectionReadingViolation[]>(
    () =>
      task.status === "critical" ? getReadingViolations(task.readings) : [],
  );
  const [isDeviationModalOpen, setIsDeviationModalOpen] = useState(false);
  const [defectFormMode, setDefectFormMode] = useState<DefectFormMode>("add");
  const [isDefectFormOpen, setIsDefectFormOpen] = useState(false);
  const [isDeleteDefectModalOpen, setIsDeleteDefectModalOpen] = useState(false);
  const [taskSuccessAlert, setTaskSuccessAlert] =
    useState<TaskSuccessAlert | null>(null);
  const formValues = (Form.useWatch([], form) ??
    initialFormValues) as ReadingFormValues;
  const statusView = inspectionTaskStatusView[status];
  const isFormComplete = inspectionReadingConfigs.every((config) => {
    const value = formValues[config.key];

    return typeof parseReadingValue(value) === "number";
  });
  const isActionDisabled = isEditing && !isFormComplete;
  const isEditingSavedTask = isEditing && task.status !== "pending";
  const canManageDefect = status === "pending" || isEditing;
  const activeDefect =
    activeDefectIndex === null ? undefined : defectInfos[activeDefectIndex];

  const syncRoundProgress = useCallback(
    async (nextStatus: InspectionTaskStatus) => {
      if (roundTasks.length > 0) {
        const nextRoundTasks = roundTasks.map((roundTask) =>
          roundTask.id === task.id
            ? { ...roundTask, status: nextStatus }
            : roundTask,
        );
        const totalTasks = nextRoundTasks.length;
        const completedTasks = nextRoundTasks.filter(
          (roundTask) => roundTask.status !== "pending",
        ).length;

        await updateRound({
          id: roundId,
          patch: {
            completedTasks,
            tasksCount: totalTasks,
            totalTasks,
          },
        }).unwrap();
        return;
      }

      if (!round) {
        return;
      }

      const wasCompleted = task.status !== "pending";
      const isCompleted = nextStatus !== "pending";
      const completedTasksDelta = Number(isCompleted) - Number(wasCompleted);
      const completedTasks = Math.max(
        0,
        Math.min(round.totalTasks, round.completedTasks + completedTasksDelta),
      );

      await updateRound({
        id: roundId,
        patch: {
          completedTasks,
          tasksCount: round.totalTasks,
          totalTasks: round.totalTasks,
        },
      }).unwrap();
    },
    [round, roundId, roundTasks, task.id, task.status, updateRound],
  );

  const openAddDefectModal = useCallback(() => {
    setActiveDefectIndex(null);
    setDefectFormMode("add");
    setIsDefectFormOpen(true);
  }, []);

  const openEditDefectModal = useCallback((defectIndex: number) => {
    setActiveDefectIndex(defectIndex);
    setDefectFormMode("edit");
    setIsDefectFormOpen(true);
  }, []);

  const closeDefectForm = useCallback(() => {
    setIsDefectFormOpen(false);
    setActiveDefectIndex(null);
  }, []);

  const openDeleteDefectModal = useCallback((defectIndex: number) => {
    setActiveDefectIndex(defectIndex);
    setIsDeleteDefectModalOpen(true);
  }, []);

  const closeDeleteDefectModal = useCallback(() => {
    setIsDeleteDefectModalOpen(false);
    setActiveDefectIndex(null);
  }, []);

  const confirmDeleteDefect = useCallback(() => {
    if (activeDefectIndex !== null) {
      const nextDefects = defectInfos.filter(
        (_, defectIndex) => defectIndex !== activeDefectIndex,
      );

      setDefectInfos(nextDefects);
      void updateTask({
        id: task.id,
        roundId,
        patch: { defects: nextDefects },
      });
    }

    setIsDeleteDefectModalOpen(false);
    setActiveDefectIndex(null);
  }, [activeDefectIndex, defectInfos, roundId, task.id, updateTask]);

  useEffect(() => {
    if (canManageDefect) {
      setTopbarAction({
        ariaLabel: "Отметить дефект",
        className: "worker-topbar__button--danger-icon",
        icon: <ExclamationCircleOutlined />,
        onClick: openAddDefectModal,
      });
    } else {
      setTopbarAction(null);
    }

    return () => setTopbarAction(undefined);
  }, [canManageDefect, openAddDefectModal, setTopbarAction]);

  useEffect(() => {
    if (!taskSuccessAlert) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setTaskSuccessAlert(null);
    }, 5000);

    return () => window.clearTimeout(timerId);
  }, [taskSuccessAlert]);

  const handleActionClick = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const readings = getReadingsFromForm(form.getFieldsValue());
    const nextViolations = getReadingViolations(readings);

    form.setFieldsValue(getReadingFormValues(readings));
    setViolations(nextViolations);
    setIsEditing(false);

    if (nextViolations.length > 0) {
      setStatus("critical");
      await updateTask({
        id: task.id,
        roundId,
        patch: {
          readings,
          status: "critical",
          statusLabel: inspectionTaskStatusView.critical.label,
          defects: defectInfos,
        },
      }).unwrap();
      await syncRoundProgress("critical");
      setIsDeviationModalOpen(true);
      return;
    }

    setStatus("checked");
    await updateTask({
      id: task.id,
      roundId,
      patch: {
        readings,
        status: "checked",
        statusLabel: inspectionTaskStatusView.checked.label,
        defects: defectInfos,
      },
    }).unwrap();
    await syncRoundProgress("checked");
    navigate(`/inspector/rounds/${roundId}`, {
      state: { taskCompleted: true },
    });
  };

  const handleReviewDeviation = () => {
    setIsDeviationModalOpen(false);
    setIsEditing(true);
  };

  const handleSubmitMaintenanceRequest = () => {
    setIsDeviationModalOpen(false);
    navigate(`/inspector/rounds/${roundId}`, {
      state: {
        maintenanceRequestSent: true,
        maintenanceTaskTitle: task.title,
      },
    });
  };

  const handleSubmitDefect = (defect: InspectionDefectInfo) => {
    const isEditingDefect = defectFormMode === "edit";
    const nextDefects =
      isEditingDefect && activeDefectIndex !== null
        ? defectInfos.map((currentDefect, defectIndex) =>
            defectIndex === activeDefectIndex ? defect : currentDefect,
          )
        : [...defectInfos, defect];

    setDefectInfos(nextDefects);
    void updateTask({
      id: task.id,
      roundId,
      patch: { defects: nextDefects },
    });
    setActiveDefectIndex(null);
    setIsDefectFormOpen(false);
    setTaskSuccessAlert({
      title: isEditingDefect ? "Данные дефекта обновлены" : "Дефект добавлен",
    });
  };

  return (
    <main className="task-detail-page">
      <Card
        className="task-detail-card"
        variant="borderless"
        styles={{ body: { padding: 0 } }}
      >
        <Flex align="center" justify="space-between" gap={16}>
          <Typography.Title level={2} className="task-detail__title">
            Задача
          </Typography.Title>

          <Badge
            color={statusView.color}
            className="task-detail__status"
            text={<Typography.Text>{statusView.label}</Typography.Text>}
          />
        </Flex>

        {status === "pending" && (
          <>
            <Alert
              type="info"
              showIcon
              className="task-detail__hint"
              description="При несоответствии реальных значений референсным, система автоматически предложит создать заявку на проведение обслуживания после проверки показателей"
            />
            <Divider className="task-detail__divider" />
          </>
        )}

        {isEditingSavedTask && (
          <>
            <Alert
              type="info"
              showIcon
              className="task-detail__edit-alert"
              title="Включено изменение данных задачи"
            />
            <Divider className="task-detail__divider" />
          </>
        )}

        {!isEditing && status === "critical" && violations.length > 0 && (
          <>
            <TaskCriticalAlert violations={violations} />
            <Divider className="task-detail__divider" />
          </>
        )}

        <TaskReadingsForm
          form={form}
          initialValues={initialFormValues}
          disabled={!isEditing}
          showRequiredMarks={isEditing}
        />

        <TaskDefectSection
          defects={defectInfos}
          canManage={canManageDefect}
          onAdd={openAddDefectModal}
          onEdit={openEditDefectModal}
          onDelete={openDeleteDefectModal}
        />
      </Card>

      {taskSuccessAlert && (
        <Alert
          type="success"
          showIcon
          closable={{ onClose: () => setTaskSuccessAlert(null) }}
          className="task-success-alert"
          title={taskSuccessAlert.title}
        />
      )}

      <Card
        className={`task-detail-bottom-action ${
          isPageBottomReached ? "task-detail-bottom-action--no-shadow" : ""
        }`}
        variant="borderless"
        styles={{ body: { padding: 0 } }}
      >
        <Button
          block
          size="large"
          type={isEditing ? "primary" : "default"}
          disabled={isActionDisabled}
          onClick={handleActionClick}
        >
          {isEditing ? "Проверить показатели" : "Изменить показатели"}
        </Button>
      </Card>

      <TaskDeviationModal
        open={isDeviationModalOpen}
        violations={violations}
        onReview={handleReviewDeviation}
        onSubmitRequest={handleSubmitMaintenanceRequest}
      />

      {isDefectFormOpen && (
        <TaskDefectFormModal
          open
          mode={defectFormMode}
          initialDefect={defectFormMode === "edit" ? activeDefect : undefined}
          onCancel={closeDefectForm}
          onSubmit={handleSubmitDefect}
        />
      )}

      <TaskDeleteDefectConfirmModal
        open={isDeleteDefectModalOpen}
        defect={activeDefect}
        onCancel={closeDeleteDefectModal}
        onConfirm={confirmDeleteDefect}
      />
    </main>
  );
}

export function WorkerTaskDetailsPage() {
  const { roundId = "12345", taskId } = useParams();
  const {
    data: task,
    isLoading,
    isError,
  } = useGetTaskQuery(taskId ?? skipToken);

  if (!taskId) {
    return <Navigate to={`/inspector/rounds/${roundId}`} replace />;
  }

  if (isLoading) {
    return (
      <main className="task-detail-page">
        <Card style={{ display: "flex", justifyContent: "center" }}>
          <Spin tip="Загружаем задачу" />
        </Card>
      </main>
    );
  }

  if (isError || !task) {
    return (
      <main className="task-detail-page">
        <Card>
          <Empty description="Задача не найдена" />
        </Card>
      </main>
    );
  }

  return <WorkerTaskDetailsContent key={task.id} task={task} />;
}
