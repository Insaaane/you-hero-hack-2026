import { baseApi } from '@/shared/api/baseApi'
import type { InspectionTask } from '../model/inspectionTask'
import type { InspectionRound } from '../model/inspectionRound'

export const inspectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRounds: builder.query<InspectionRound[], void>({
      query: () => '/rounds',
      providesTags: (result) =>
        result
          ? [
              { type: 'Rounds', id: 'LIST' },
              ...result.map((round) => ({ type: 'Round' as const, id: round.id })),
            ]
          : [{ type: 'Rounds', id: 'LIST' }],
    }),
    getRound: builder.query<InspectionRound, string>({
      query: (roundId) => `/rounds/${roundId}`,
      providesTags: (_result, _error, roundId) => [{ type: 'Round', id: roundId }],
    }),
    getTasks: builder.query<InspectionTask[], void>({
      query: () => '/tasks',
      providesTags: (result) =>
        result
          ? [
              { type: 'Tasks', id: 'LIST' },
              ...result.map((task) => ({ type: 'Task' as const, id: task.id })),
            ]
          : [{ type: 'Tasks', id: 'LIST' }],
    }),
    createRound: builder.mutation<InspectionRound, InspectionRound>({
      query: (round) => ({
        url: '/rounds',
        method: 'POST',
        body: round,
      }),
      invalidatesTags: [{ type: 'Rounds', id: 'LIST' }],
    }),
    updateRound: builder.mutation<
      InspectionRound,
      { id: string; patch: Partial<InspectionRound> }
    >({
      query: ({ id, patch }) => ({
        url: `/rounds/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Round', id },
        { type: 'Rounds', id: 'LIST' },
      ],
    }),
    getTasksByRound: builder.query<InspectionTask[], string>({
      query: (roundId) => ({
        url: '/tasks',
        params: { roundId },
      }),
      providesTags: (result, _error, roundId) =>
        result
          ? [
              { type: 'Tasks', id: roundId },
              ...result.map((task) => ({ type: 'Task' as const, id: task.id })),
            ]
          : [{ type: 'Tasks', id: roundId }],
    }),
    getTask: builder.query<InspectionTask, string>({
      query: (taskId) => `/tasks/${taskId}`,
      providesTags: (_result, _error, taskId) => [{ type: 'Task', id: taskId }],
    }),
    createTask: builder.mutation<InspectionTask, InspectionTask>({
      query: (task) => ({
        url: '/tasks',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: (_result, _error, task) => [
        { type: 'Tasks', id: task.roundId },
        { type: 'Tasks', id: 'LIST' },
        { type: 'Rounds', id: 'LIST' },
      ],
    }),
    updateTask: builder.mutation<
      InspectionTask,
      { id: string; roundId?: string; patch: Partial<InspectionTask> }
    >({
      query: ({ id, patch }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id, roundId }) => [
        { type: 'Task', id },
        ...(roundId ? [{ type: 'Tasks' as const, id: roundId }] : []),
        { type: 'Tasks', id: 'LIST' },
        { type: 'Rounds', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useCreateRoundMutation,
  useCreateTaskMutation,
  useGetRoundQuery,
  useGetRoundsQuery,
  useGetTaskQuery,
  useGetTasksQuery,
  useGetTasksByRoundQuery,
  useUpdateRoundMutation,
  useUpdateTaskMutation,
} = inspectionApi
