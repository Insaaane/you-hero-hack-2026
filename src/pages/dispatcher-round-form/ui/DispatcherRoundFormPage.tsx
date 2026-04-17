import { useMemo, useState } from "react";
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
  dispatcherRounds,
  roundTypeLabels,
  type DispatcherRound,
  type DispatcherRoundType,
} from "@/pages/dispatcher-rounds/model/mockDispatcherRounds";

type RoundFormValues = {
  type: DispatcherRoundType;
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
  round?: DispatcherRound;
};

const equipmentOptions = [
  "Бочка с камнями 52",
  "Токарный станок 52",
  "Токарный станок 22808",
  "Насос 67",
  "Бетономешалка 14",
  "Компрессор 31",
].map((value) => ({ value }));

const metricOptions = ["Температура", "Давление", "Вибрация", "Уровень масла"].map(
  (value) => ({ value }),
);

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

function getNextRoundNumber() {
  const nextNumber = dispatcherRounds.length + 1;

  return `AT-${String(nextNumber).padStart(5, "0")}`;
}

function getInitialRoundValues(round?: DispatcherRound): Partial<RoundFormValues> {
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

function TaskMetrics({ metrics }: { metrics: string[] }) {
  return (
    <Typography.Text type="secondary" className="dispatcher-round-task__metrics">
      {metrics.join("  •  ")}
    </Typography.Text>
  );
}

export function DispatcherRoundFormPage() {
  const { roundId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as DispatcherRoundFormLocationState | null;
  const [roundForm] = Form.useForm<RoundFormValues>();
  const [draftForm] = Form.useForm<TaskDraft>();
  const existingRound = useMemo(
    () =>
      locationState?.round ??
      dispatcherRounds.find((round) => round.id === roundId),
    [locationState?.round, roundId],
  );
  const isEditMode = Boolean(roundId);
  const [tasks, setTasks] = useState<EditableTask[]>(() =>
    isEditMode ? initialTasks : [],
  );
  const [isDraftVisible, setIsDraftVisible] = useState(false);
  const pageTitle = isEditMode ? "Редактирование обхода" : "Создание обхода";
  const submitLabel = isEditMode ? "Редактировать обход" : "Создать обход";
  const taskCount = tasks.length + (isDraftVisible ? 1 : 0);

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

    setTasks((currentTasks) => [nextTask, ...currentTasks]);
    setIsDraftVisible(false);
  };

  const handleUpdateTask = (taskId: string, values: TaskDraft) => {
    setTasks((currentTasks) =>
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
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, expanded: !task.expanded } : task,
      ),
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
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
      setTasks(tasksForRound);
      setIsDraftVisible(false);
    }

    const round: DispatcherRound = {
      id: existingRound?.id ?? `round-${crypto.randomUUID()}`,
      number: existingRound?.number ?? getNextRoundNumber(),
      type: values.type,
      tasksCount: tasksForRound.length,
      executor: {
        name: values.executor,
        avatarUrl: existingRound?.executor.avatarUrl ?? "https://i.pravatar.cc/80?img=12",
      },
      date: formatDate(values.date),
      plannedTime: values.plannedTime.format("HH:mm"),
    };

    navigate("/dispatcher", {
      state: {
        savedRound: round,
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
                <Link to="/dispatcher">
                  <HomeOutlined /> Главная
                </Link>
              ),
            },
            { title: pageTitle },
          ]}
        />

        <Flex align="center" justify="space-between" gap={24}>
          <Typography.Title level={1} className="dispatcher-round-form-page__title">
            {pageTitle}
          </Typography.Title>

          <Button type="primary" onClick={() => void handleSubmitRound()}>
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
            <Typography.Text type="secondary">{formatTaskCount(taskCount)}</Typography.Text>
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
                <Typography.Title level={3} className="dispatcher-round-task__title">
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
                  <Button onClick={() => setIsDraftVisible(false)}>Удалить</Button>
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
