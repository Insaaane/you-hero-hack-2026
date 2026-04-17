type InspectionTaskStatus =
  | "current"
  | "checked"
  | "critical"
  | "defect"
  | "pending";

export type InspectionTask = {
  id: string;
  title: string;
  status: InspectionTaskStatus;
  statusLabel: string;
  workshop: string;
};

export const inspectionRequest = {
  id: "1488228",
  reason: "Инцидент",
  date: "18 апреля 2026",
  time: "12:00",
  completedTasks: 2,
  totalTasks: 10,
  tasks: [
    {
      id: "task-1",
      title: "Бочка камнями 52",
      status: "current",
      statusLabel: "Текущая задача",
      workshop: "Цех 3",
    },
    {
      id: "task-2",
      title: "Токарный станок 22808",
      status: "checked",
      statusLabel: "Проверено",
      workshop: "Цех 3",
    },
    {
      id: "task-3",
      title: "Насос 67",
      status: "critical",
      statusLabel: "Критическое отклонение",
      workshop: "Цех 3",
    },
    {
      id: "task-4",
      title: "Насос 67",
      status: "defect",
      statusLabel: "Дефект",
      workshop: "Цех 3",
    },
    {
      id: "task-5",
      title: "Бетономешалка 14",
      status: "pending",
      statusLabel: "Ожидает проверки",
      workshop: "Цех 3",
    },
    {
      id: "task-6",
      title: "Бочка камнями 52",
      status: "pending",
      statusLabel: "Ожидает проверки",
      workshop: "Цех 3",
    },
    {
      id: "task-7",
      title: "Компрессор 31",
      status: "pending",
      statusLabel: "Ожидает проверки",
      workshop: "Цех 3",
    },
    {
      id: "task-8",
      title: "Шкаф управления 19",
      status: "pending",
      statusLabel: "Ожидает проверки",
      workshop: "Цех 3",
    },
    {
      id: "task-9",
      title: "Вентилятор 4",
      status: "pending",
      statusLabel: "Ожидает проверки",
      workshop: "Цех 3",
    },
    {
      id: "task-10",
      title: "Трубопровод 7",
      status: "pending",
      statusLabel: "Ожидает проверки",
      workshop: "Цех 3",
    },
  ] satisfies InspectionTask[],
};
