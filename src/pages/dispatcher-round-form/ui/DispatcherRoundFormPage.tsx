import { useEffect, useMemo, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  DownOutlined,
  HomeOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  AutoComplete,
  Breadcrumb,
  Button,
  Card,
  DatePicker,
  Divider,
  Flex,
  Form,
  Select,
  Space,
  TimePicker,
  Typography,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import {
  roundTypeLabels,
  useCreateRoundMutation,
  useGetRoundQuery,
  useGetRoundsQuery,
  useGetTasksByRoundQuery,
  useUpdateRoundMutation,
  type InspectionRound,
  type InspectionRoundType,
  type InspectionTask,
} from "@/entities/inspection";

type RoundFormValues = {
  type: InspectionRoundType;
  date: Dayjs;
  plannedTime: Dayjs;
  executor: string;
};

type TaskDraft = {
  objectName: string;
  metrics: string[];
};

type EditableTask = TaskDraft & {
  id: string;
  title: string;
  expanded: boolean;
};

type DispatcherRoundFormLocationState = {
  round?: InspectionRound;
};

const equipmentOptions = [
  "Станок 52",
  "Токарный станок 52",
  "Токарный станок 22808",
  "Насос 67",
  "Бетономешалка 14",
  "Компрессор 31",
].map((value) => ({ value }));

const metricOptions = [
  "Температура",
  "Давление",
  "Вибрация",
  "Уровень масла",
].map((value) => ({ value }));

const executorOptions = [
  "Петров Пётр Петрович",
  "Иванов Иван Иванович",
  "Сидоров Алексей Михайлович",
].map((value) => ({ value }));

const initialTasks: EditableTask[] = [
  {
    id: "task-form-1",
    title: "Токарный станок 22808",
    objectName: "Токарный станок 52",
    metrics: ["Температура", "Давление", "Вибрация"],
    expanded: true,
  },
  {
    id: "task-form-2",
    title: "Токарный станок 22808",
    objectName: "Токарный станок 22808",
    metrics: ["Температура", "Давление", "Вибрация"],
    expanded: false,
  },
];

const monthNames = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

function formatDate(date: Dayjs) {
  return `${date.date()} ${monthNames[date.month()]} ${date.year()}`;
}

function parseRoundDate(date: string) {
  const [day, month, year] = date.split(" ");
  const monthIndex = monthNames.indexOf(month);

  return dayjs(new Date(Number(year), Math.max(monthIndex, 0), Number(day)));
}

function parseRoundTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  return dayjs().hour(hours).minute(minutes).second(0).millisecond(0);
}

function formatTaskCount(count: number) {
  if (count % 10 === 1 && count % 100 !== 11) {
    return `${count} задача`;
  }

  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return `${count} задачи`;
  }

  return `${count} задач`;
}

function getNextRoundNumber(rounds: InspectionRound[]) {
  const nextNumber = rounds.length + 1;

  return `AT-${String(nextNumber).padStart(5, "0")}`;
}

function getInitialRoundValues(
  round?: InspectionRound,
): Partial<RoundFormValues> {
  if (!round) {
    return {};
  }

  return {
    type: round.type,
    date: parseRoundDate(round.date),
    plannedTime: parseRoundTime(round.plannedTime),
    executor: round.executor.name,
  };
}

function mapApiTaskToEditableTask(task: InspectionTask): EditableTask {
  return {
    id: task.id,
    title: task.title,
    objectName: task.title,
    metrics: ["Температура", "Давление", "Вибрация"],
    expanded: false,
  };
}

function TaskMetrics({ metrics }: { metrics: string[] }) {
  return (
    <Typography.Text
      type="secondary"
      className="dispatcher-round-task__metrics"
    >
      {metrics.join("  •  ")}
    </Typography.Text>
  );
}

export function DispatcherRoundFormPage() {
  const { roundId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState =
    location.state as DispatcherRoundFormLocationState | null;
  const [roundForm] = Form.useForm<RoundFormValues>();
  const [draftForm] = Form.useForm<TaskDraft>();
  const isEditMode = Boolean(roundId);
  const { data: rounds = [] } = useGetRoundsQuery();
  const { data: roundFromApi } = useGetRoundQuery(roundId ?? skipToken);
  const { data: roundTasks = [] } = useGetTasksByRoundQuery(
    roundId ?? skipToken,
  );
  const [createRound, { isLoading: isCreatingRound }] =
    useCreateRoundMutation();
  const [updateRound, { isLoading: isUpdatingRound }] =
    useUpdateRoundMutation();
  const existingRound = useMemo(
    () => locationState?.round ?? roundFromApi,
    [locationState?.round, roundFromApi],
  );
  const loadedTasks = useMemo(() => {
    if (!isEditMode) {
      return [];
    }

    if (roundTasks.length === 0) {
      return existingRound ? initialTasks : [];
    }

    return roundTasks.map((task, taskIndex) => ({
      ...mapApiTaskToEditableTask(task),
      expanded: taskIndex === 0,
    }));
  }, [existingRound, isEditMode, roundTasks]);
  const [taskEdits, setTaskEdits] = useState<EditableTask[] | null>(null);
  const tasks = taskEdits ?? loadedTasks;
  const [isDraftVisible, setIsDraftVisible] = useState(false);
  const pageTitle = isEditMode ? "Редактирование обхода" : "Создание обхода";
  const submitLabel = isEditMode ? "Редактировать обход" : "Создать обход";
  const taskCount = tasks.length + (isDraftVisible ? 1 : 0);
  const isSubmittingRound = isCreatingRound || isUpdatingRound;

  useEffect(() => {
    if (!existingRound) {
      return;
    }

    roundForm.setFieldsValue(getInitialRoundValues(existingRound));
  }, [existingRound, roundForm]);

  const updateTasks = (
    updater: (currentTasks: EditableTask[]) => EditableTask[],
  ) => {
    setTaskEdits((currentTasks) => updater(currentTasks ?? loadedTasks));
  };

  const handleAddDraft = () => {
    draftForm.resetFields();
    setIsDraftVisible(true);
  };

  const handleSaveDraft = async () => {
    const values = await draftForm.validateFields();
    const nextTask: EditableTask = {
      id: `task-form-${crypto.randomUUID()}`,
      title: values.objectName,
      objectName: values.objectName,
      metrics: values.metrics,
      expanded: false,
    };

    updateTasks((currentTasks) => [nextTask, ...currentTasks]);
    setIsDraftVisible(false);
  };

  const handleUpdateTask = (taskId: string, values: TaskDraft) => {
    updateTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title: values.objectName,
              objectName: values.objectName,
              metrics: values.metrics,
              expanded: false,
            }
          : task,
      ),
    );
  };

  const handleToggleTask = (taskId: string) => {
    updateTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, expanded: !task.expanded } : task,
      ),
    );
  };

  const handleDeleteTask = (taskId: string) => {
    updateTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
  };

  const handleSubmitRound = async () => {
    const values = await roundForm.validateFields();
    let tasksForRound = tasks;

    if (isDraftVisible) {
      const draftValues = await draftForm.validateFields();
      const draftTask: EditableTask = {
        id: `task-form-${crypto.randomUUID()}`,
        title: draftValues.objectName,
        objectName: draftValues.objectName,
        metrics: draftValues.metrics,
        expanded: false,
      };

      tasksForRound = [draftTask, ...tasks];
      setTaskEdits(tasksForRound);
      setIsDraftVisible(false);
    }

    const plannedTime = values.plannedTime.format("HH:mm");
    const round: InspectionRound = {
      id: existingRound?.id ?? `round-${crypto.randomUUID()}`,
      number: existingRound?.number ?? getNextRoundNumber(rounds),
      type: values.type,
      status: existingRound?.status ?? "planned",
      reason: roundTypeLabels[values.type],
      tasksCount: tasksForRound.length,
      completedTasks: existingRound?.completedTasks ?? 0,
      totalTasks: tasksForRound.length,
      executor: {
        id: existingRound?.executor.id ?? `employee-${crypto.randomUUID()}`,
        name: values.executor,
        avatarUrl:
          existingRound?.executor.avatarUrl ??
          "https://i.pravatar.cc/80?img=12",
      },
      date: formatDate(values.date),
      time: plannedTime,
      plannedTime,
    };

    const savedRound = isEditMode
      ? await updateRound({ id: round.id, patch: round }).unwrap()
      : await createRound(round).unwrap();

    navigate("/dispatcher/rounds", {
      state: {
        savedRound,
        roundSaveMode: isEditMode ? "edit" : "create",
      },
    });
  };

  return (
    <main className="dispatcher-round-form-page">
      <section className="dispatcher-round-form-page__header">
        <Breadcrumb
          className="dispatcher-round-form-page__breadcrumbs"
          items={[
            {
              title: (
                <Link to="/dispatcher/rounds">
                  <HomeOutlined /> Главная
                </Link>
              ),
            },
            { title: pageTitle },
          ]}
        />

        <Flex align="center" justify="space-between" gap={24}>
          <Typography.Title
            level={1}
            className="dispatcher-round-form-page__title"
          >
            {pageTitle}
          </Typography.Title>

          <Button
            type="primary"
            loading={isSubmittingRound}
            onClick={() => void handleSubmitRound()}
          >
            {submitLabel}
          </Button>
        </Flex>
      </section>

      <section className="dispatcher-round-form-page__body">
        <Card
          className="dispatcher-round-tasks-card"
          variant="borderless"
          styles={{ body: { padding: 16 } }}
        >
          <Flex align="center" justify="space-between" gap={16}>
            <Typography.Title level={2} className="dispatcher-round-card-title">
              Задачи
            </Typography.Title>
            <Typography.Text type="secondary">
              {formatTaskCount(taskCount)}
            </Typography.Text>
          </Flex>

          <Button
            block
            className="dispatcher-round-tasks-card__add"
            onClick={handleAddDraft}
          >
            Добавить задачу
          </Button>

          <Divider className="dispatcher-round-tasks-card__divider" />

          <Space
            orientation="vertical"
            size={16}
            className="dispatcher-round-tasks-card__list"
          >
            {isDraftVisible && (
              <Card
                className="dispatcher-round-task dispatcher-round-task--expanded"
                styles={{ body: { padding: 16 } }}
              >
                <Typography.Title
                  level={3}
                  className="dispatcher-round-task__title"
                >
                  Новая задача
                </Typography.Title>

                <Form
                  form={draftForm}
                  layout="vertical"
                  className="dispatcher-round-task__form"
                >
                  <Form.Item
                    name="objectName"
                    label="Объект"
                    rules={[{ required: true, message: "Выберите объект" }]}
                  >
                    <AutoComplete
                      options={equipmentOptions}
                      placeholder="Начните вводить название"
                    />
                  </Form.Item>

                  <Form.Item
                    name="metrics"
                    label="Метрики"
                    rules={[{ required: true, message: "Добавьте метрики" }]}
                  >
                    <Select
                      mode="tags"
                      options={metricOptions}
                      placeholder="Введите метрики"
                    />
                  </Form.Item>
                </Form>

                <Divider className="dispatcher-round-task__divider" />

                <Flex justify="end" gap={12}>
                  <Button onClick={() => setIsDraftVisible(false)}>
                    Удалить
                  </Button>
                  <Button type="primary" onClick={() => void handleSaveDraft()}>
                    Сохранить задачу
                  </Button>
                </Flex>
              </Card>
            )}

            {tasks.map((task) =>
              task.expanded ? (
                <Card
                  key={task.id}
                  className="dispatcher-round-task dispatcher-round-task--expanded"
                  styles={{ body: { padding: 16 } }}
                >
                  <Flex align="start" justify="space-between" gap={16}>
                    <Space orientation="vertical" size={8}>
                      <Typography.Title
                        level={3}
                        className="dispatcher-round-task__title"
                      >
                        {task.title}
                      </Typography.Title>
                      <TaskMetrics metrics={task.metrics} />
                    </Space>

                    <Button
                      type="text"
                      aria-label="Свернуть задачу"
                      icon={<DownOutlined />}
                      onClick={() => handleToggleTask(task.id)}
                    />
                  </Flex>

                  <Divider className="dispatcher-round-task__divider" />

                  <TaskEditForm
                    task={task}
                    onDelete={() => handleDeleteTask(task.id)}
                    onSave={(values) => handleUpdateTask(task.id, values)}
                  />
                </Card>
              ) : (
                <Card
                  key={task.id}
                  className="dispatcher-round-task"
                  styles={{ body: { padding: 16 } }}
                  onClick={() => handleToggleTask(task.id)}
                >
                  <Flex align="center" justify="space-between" gap={16}>
                    <Space orientation="vertical" size={8}>
                      <Typography.Title
                        level={3}
                        className="dispatcher-round-task__title"
                      >
                        {task.title}
                      </Typography.Title>
                      <TaskMetrics metrics={task.metrics} />
                    </Space>
                    <RightOutlined className="dispatcher-round-task__chevron" />
                  </Flex>
                </Card>
              ),
            )}
          </Space>
        </Card>

        <Card
          className="dispatcher-round-data-card"
          variant="borderless"
          styles={{ body: { padding: 16 } }}
        >
          <Typography.Title level={2} className="dispatcher-round-card-title">
            Данные об обходе
          </Typography.Title>

          <Form
            form={roundForm}
            layout="vertical"
            initialValues={getInitialRoundValues(existingRound)}
            className="dispatcher-round-data-card__form"
          >
            <Form.Item
              name="type"
              label="Тип обхода"
              rules={[{ required: true, message: "Выберите тип обхода" }]}
            >
              <Select
                placeholder="Выберите тип"
                options={[
                  { value: "planned", label: roundTypeLabels.planned },
                  { value: "incident", label: roundTypeLabels.incident },
                ]}
              />
            </Form.Item>

            <Flex gap={16}>
              <Form.Item
                name="date"
                label="Дата"
                rules={[{ required: true, message: "Выберите дату" }]}
                className="dispatcher-round-data-card__half"
              >
                <DatePicker format="DD.MM.YYYY" placeholder="дд.мм.гггг" />
              </Form.Item>

              <Form.Item
                name="plannedTime"
                label="Планируемое время"
                rules={[{ required: true, message: "Выберите время" }]}
                className="dispatcher-round-data-card__half"
              >
                <TimePicker format="HH:mm" placeholder="" minuteStep={5} />
              </Form.Item>
            </Flex>

            <Form.Item
              name="executor"
              label="Исполнитель"
              rules={[{ required: true, message: "Выберите исполнителя" }]}
            >
              <AutoComplete
                options={executorOptions}
                placeholder="Начните вводить имя"
                prefix={<UserOutlined />}
              />
            </Form.Item>
          </Form>
        </Card>
      </section>
    </main>
  );
}

function TaskEditForm({
  task,
  onDelete,
  onSave,
}: {
  task: EditableTask;
  onDelete: () => void;
  onSave: (values: TaskDraft) => void;
}) {
  const [form] = Form.useForm<TaskDraft>();

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          objectName: task.objectName,
          metrics: task.metrics,
        }}
        className="dispatcher-round-task__form"
      >
        <Form.Item
          name="objectName"
          label="Объект"
          rules={[{ required: true, message: "Выберите объект" }]}
        >
          <AutoComplete options={equipmentOptions} />
        </Form.Item>

        <Form.Item
          name="metrics"
          label="Метрики"
          rules={[{ required: true, message: "Добавьте метрики" }]}
        >
          <Select mode="tags" options={metricOptions} />
        </Form.Item>
      </Form>

      <Divider className="dispatcher-round-task__divider" />

      <Flex justify="end" gap={12}>
        <Button onClick={onDelete}>Удалить</Button>
        <Button
          type="primary"
          onClick={() => {
            void form.validateFields().then(onSave);
          }}
        >
          Сохранить
        </Button>
      </Flex>
    </>
  );
}
