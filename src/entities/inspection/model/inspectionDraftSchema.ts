import { z } from 'zod'

export const inspectionDraftSchema = z.object({
  equipmentId: z.string().min(1),
  routeId: z.string().min(1),
  measuredAt: z.string().datetime(),
  comment: z.string().max(1000).optional(),
})

export type InspectionDraft = z.infer<typeof inspectionDraftSchema>
