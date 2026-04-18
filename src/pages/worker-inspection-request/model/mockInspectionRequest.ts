import { inspectionTasks, type InspectionTask } from "@/entities/inspection";

export type { InspectionTask };

export const inspectionRequest = {
  id: "12345",
  reason: "Плановый обход",
  date: "18 апреля 2026",
  time: "12:00",
  completedTasks: 2,
  totalTasks: 10,
  tasks: inspectionTasks,
};
