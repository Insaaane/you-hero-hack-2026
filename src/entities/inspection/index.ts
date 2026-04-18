export {
  inspectionDraftSchema,
  type InspectionDraft,
} from './model/inspectionDraftSchema'
export {
  roundTypeLabels,
  type InspectionRound,
  type InspectionRoundDetails,
  type InspectionRoundExecutor,
  type InspectionRoundStatus,
  type InspectionRoundType,
} from './model/inspectionRound'
export {
  useCreateRoundMutation,
  useCreateTaskMutation,
  useGetRoundQuery,
  useGetRoundsQuery,
  useGetTaskQuery,
  useGetTasksQuery,
  useGetTasksByRoundQuery,
  useUpdateRoundMutation,
  useUpdateTaskMutation,
} from './api/inspectionApi'
export {
  getInspectionTaskById,
  getReadingViolations,
  inspectionReadingConfigs,
  inspectionTasks,
  inspectionTaskStatusView,
  mockDefectInfo,
  mockDefectReadings,
  type InspectionDefectInfo,
  type InspectionReadingKey,
  type InspectionReadingValues,
  type InspectionReadingViolation,
  type InspectionTask,
  type InspectionTaskStatus,
} from './model/inspectionTask'
