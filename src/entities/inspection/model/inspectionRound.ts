import type { InspectionTask } from './inspectionTask'

export type InspectionRoundType = 'planned' | 'incident'

export type InspectionRoundStatus = 'planned' | 'active' | 'completed'

export type InspectionRoundExecutor = {
  id: string
  name: string
  avatarUrl: string
}

export type InspectionRound = {
  id: string
  number: string
  type: InspectionRoundType
  status: InspectionRoundStatus
  reason: string
  date: string
  time: string
  plannedTime: string
  tasksCount: number
  completedTasks: number
  totalTasks: number
  executor: InspectionRoundExecutor
}

export type InspectionRoundDetails = InspectionRound & {
  tasks: InspectionTask[]
}

export const roundTypeLabels: Record<InspectionRoundType, string> = {
  planned: 'Плановый обход',
  incident: 'Инцидент',
}
