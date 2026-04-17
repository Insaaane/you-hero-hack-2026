import { useCallback, useEffect, useMemo, useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  Form,
  Typography,
} from "antd";
import {
  Navigate,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router";
import {
  getInspectionTaskById,
  getReadingViolations,
  inspectionReadingConfigs,
  inspectionTaskStatusView,
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
  const isPageBottomReached = useIsPageBottomReached();
  const [form] = Form.useForm<ReadingFormValues>();
  const initialFormValues = useMemo(
    () => getReadingFormValues(task.readings),
    [task.readings],
  );
  const [status, setStatus] = useState<InspectionTaskStatus>(task.status);
  const [isEditing, setIsEditing] = useState(task.status === "pending");
  const [defectInfo, setDefectInfo] = useState<
    InspectionDefectInfo | undefined
  >(task.defect);
  const [violations, setViolations] = useState<InspectionReadingViolation[]>(
    () =>
      task.status === "critical" ? getReadingViolations(task.readings) : [],
  );
  const [isDeviationModalOpen, setIsDeviationModalOpen] = useState(false);
  const [defectFormMode, setDefectFormMode] = useState<DefectFormMode>("add");
  const [isDefectFormOpen, setIsDefectFormOpen] = useState(false);
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

  const openAddDefectModal = useCallback(() => {
    setDefectFormMode(defectInfo ? "edit" : "add");
    setIsDefectFormOpen(true);
  }, [defectInfo]);

  const openEditDefectModal = useCallback(() => {
    setDefectFormMode("edit");
    setIsDefectFormOpen(true);
  }, []);

  const closeDefectForm = useCallback(() => {
    setIsDefectFormOpen(false);
  }, []);

  const deleteDefect = useCallback(() => {
    setDefectInfo(undefined);
  }, []);

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

  const handleActionClick = () => {
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
      setIsDeviationModalOpen(true);
      return;
    }

    setStatus("checked");
    navigate("/inspector/rounds/1488228", {
      state: { taskCompleted: true },
    });
  };

  const handleReviewDeviation = () => {
    setIsDeviationModalOpen(false);
    setIsEditing(true);
  };

  const handleSubmitMaintenanceRequest = () => {
    setIsDeviationModalOpen(false);
    navigate("/inspector/rounds/1488228", {
      state: {
        maintenanceRequestSent: true,
        maintenanceTaskTitle: task.title,
      },
    });
  };

  const handleSubmitDefect = (defect: InspectionDefectInfo) => {
    const isEditingDefect = defectFormMode === "edit";

    setDefectInfo(defect);
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
          defect={defectInfo}
          canManage={canManageDefect}
          onAdd={openAddDefectModal}
          onEdit={openEditDefectModal}
          onDelete={deleteDefect}
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
          initialDefect={defectFormMode === "edit" ? defectInfo : undefined}
          onCancel={closeDefectForm}
          onSubmit={handleSubmitDefect}
        />
      )}
    </main>
  );
}

export function WorkerTaskDetailsPage() {
  const { taskId } = useParams();
  const task = getInspectionTaskById(taskId);

  if (!task) {
    return <Navigate to="/inspector/rounds/1488228" replace />;
  }

  return <WorkerTaskDetailsContent key={task.id} task={task} />;
}
