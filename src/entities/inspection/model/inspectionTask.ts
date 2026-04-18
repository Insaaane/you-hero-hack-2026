export type InspectionTaskStatus = "pending" | "checked" | "critical";

export type InspectionReadingKey = "temperature" | "pressure" | "vibration";

export type InspectionReadingValues = Partial<
  Record<InspectionReadingKey, number>
>;

export type InspectionReadingConfig = {
  key: InspectionReadingKey;
  label: string;
  shortLabel: string;
  unit: string;
  placeholder: string;
  range: {
    min?: number;
    max?: number;
  };
};

export type InspectionReadingViolation = {
  key: InspectionReadingKey;
  label: string;
  value: number;
  min?: number;
  max?: number;
};

export type InspectionDefectPhoto = {
  id: string;
  src: string;
  alt: string;
};

export type InspectionDefectInfo = {
  title: string;
  comment: string;
  photos: InspectionDefectPhoto[];
};

export type InspectionTask = {
  id: string;
  roundId: string;
  title: string;
  status: InspectionTaskStatus;
  statusLabel: string;
  workshop: string;
  marker?: string;
  readings: InspectionReadingValues;
  defect?: InspectionDefectInfo;
  defects?: InspectionDefectInfo[];
};

export const inspectionTaskStatusView: Record<
  InspectionTaskStatus,
  { label: string; color: string }
> = {
  pending: {
    label: "Ожидает проверки",
    color: "#d9d9d9",
  },
  checked: {
    label: "Проверено",
    color: "#52c41a",
  },
  critical: {
    label: "Критическое отклонение",
    color: "#ff4d4f",
  },
};

export const inspectionReadingConfigs: InspectionReadingConfig[] = [
  {
    key: "temperature",
    label: "Температура, °C",
    shortLabel: "Температура",
    unit: "°C",
    placeholder: "В норме: 70 - 150 °C",
    range: {
      min: 70,
      max: 150,
    },
  },
  {
    key: "pressure",
    label: "Давление, МПа",
    shortLabel: "Давление",
    unit: "МПа",
    placeholder: "В норме: 8 - 16 МПа",
    range: {
      min: 8,
      max: 16,
    },
  },
  {
    key: "vibration",
    label: "Вибрация, Дб",
    shortLabel: "Вибрация",
    unit: "дб",
    placeholder: "В норме: <140 дб",
    range: {
      max: 140,
    },
  },
];

export const mockDefectReadings: InspectionReadingValues = {
  temperature: 123,
  pressure: 10,
  vibration: 133,
};

export const mockDefectInfo: InspectionDefectInfo = {
  title: "Название дефекта",
  comment:
    "Во время обхода произошла неприятная ситуация: из станка выпала гайка и я прикрепляю фотографии данного инцидента",
  photos: [
    {
      id: "defect-photo-1",
      src: "https://cdn.pixabay.com/photo/2017/07/11/23/38/construction-2495410_1280.jpg",
      alt: "Разрушенный бетон и строительный мусор",
    },
    {
      id: "defect-photo-2",
      src: "https://cdn.pixabay.com/photo/2014/04/09/10/26/building-rubble-319986_1280.jpg",
      alt: "Мешки и обломки у стены",
    },
    {
      id: "defect-photo-3",
      src: "https://cdn.pixabay.com/photo/2016/10/04/18/23/garbage-1715064_1280.jpg",
      alt: "Старые шины и мусор",
    },
  ],
};

export const inspectionTasks: InspectionTask[] = [
  {
    id: "task-1",
    roundId: "12345",
    title: "Станок 52",
    status: "pending",
    statusLabel: inspectionTaskStatusView.pending.label,
    workshop: "Цех 3",
    marker: "Следующая",
    readings: {},
  },
  {
    id: "task-2",
    roundId: "12345",
    title: "Токарный станок 22808",
    status: "checked",
    statusLabel: inspectionTaskStatusView.checked.label,
    workshop: "Цех 3",
    readings: mockDefectReadings,
  },
  {
    id: "task-3",
    roundId: "12345",
    title: "Насос 67",
    status: "critical",
    statusLabel: inspectionTaskStatusView.critical.label,
    workshop: "Цех 3",
    readings: {
      temperature: 180,
      pressure: 20,
      vibration: 150,
    },
  },
  {
    id: "task-4",
    roundId: "12345",
    title: "Насос 67",
    status: "checked",
    statusLabel: inspectionTaskStatusView.checked.label,
    workshop: "Цех 3",
    readings: mockDefectReadings,
    defect: mockDefectInfo,
  },
  {
    id: "task-5",
    roundId: "12345",
    title: "Бетономешалка 14",
    status: "pending",
    statusLabel: inspectionTaskStatusView.pending.label,
    workshop: "Цех 3",
    readings: {},
  },
  {
    id: "task-6",
    roundId: "12345",
    title: "Станок 52",
    status: "pending",
    statusLabel: inspectionTaskStatusView.pending.label,
    workshop: "Цех 3",
    readings: {},
  },
  {
    id: "task-7",
    roundId: "12345",
    title: "Компрессор 31",
    status: "pending",
    statusLabel: inspectionTaskStatusView.pending.label,
    workshop: "Цех 3",
    readings: {},
  },
  {
    id: "task-8",
    roundId: "12345",
    title: "Шкаф управления 19",
    status: "pending",
    statusLabel: inspectionTaskStatusView.pending.label,
    workshop: "Цех 3",
    readings: {},
  },
  {
    id: "task-9",
    roundId: "12345",
    title: "Вентилятор 4",
    status: "pending",
    statusLabel: inspectionTaskStatusView.pending.label,
    workshop: "Цех 3",
    readings: {},
  },
  {
    id: "task-10",
    roundId: "12345",
    title: "Трубопровод 7",
    status: "pending",
    statusLabel: inspectionTaskStatusView.pending.label,
    workshop: "Цех 3",
    readings: {},
  },
];

export function getInspectionTaskById(taskId?: string) {
  return inspectionTasks.find((task) => task.id === taskId);
}

export function getReadingViolations(readings: InspectionReadingValues) {
  return inspectionReadingConfigs.reduce<InspectionReadingViolation[]>(
    (violations, config) => {
      const value = readings[config.key];

      if (typeof value !== "number" || Number.isNaN(value)) {
        return violations;
      }

      if (typeof config.range.min === "number" && value < config.range.min) {
        violations.push({
          key: config.key,
          label: config.shortLabel,
          value,
          min: config.range.min,
        });
      }

      if (typeof config.range.max === "number" && value > config.range.max) {
        violations.push({
          key: config.key,
          label: config.shortLabel,
          value,
          max: config.range.max,
        });
      }

      return violations;
    },
    [],
  );
}
