import { useEffect, useState } from 'react'
import { Button, Progress, Typography } from 'antd'
import { useNavigate } from 'react-router'
import {
  inspectionRequest,
  type InspectionTask,
} from '../model/mockInspectionRequest'

const { Text, Title } = Typography

const taskStatusClassName: Record<InspectionTask['status'], string> = {
  current: 'inspection-task__status-dot--current',
  checked: 'inspection-task__status-dot--checked',
  critical: 'inspection-task__status-dot--critical',
  defect: 'inspection-task__status-dot--defect',
  pending: 'inspection-task__status-dot--pending',
}

export function WorkerInspectionRequestPage() {
  const navigate = useNavigate()
  const [isPageBottomReached, setIsPageBottomReached] = useState(false)
  const progressPercent =
    (inspectionRequest.completedTasks / inspectionRequest.totalTasks) * 100

  useEffect(() => {
    const updateBottomState = () => {
      const scrollBottom = window.scrollY + window.innerHeight
      const pageBottom = document.documentElement.scrollHeight

      setIsPageBottomReached(scrollBottom >= pageBottom - 2)
    }

    updateBottomState()
    window.addEventListener('scroll', updateBottomState, { passive: true })
    window.addEventListener('resize', updateBottomState)

    return () => {
      window.removeEventListener('scroll', updateBottomState)
      window.removeEventListener('resize', updateBottomState)
    }
  }, [])

  return (
    <main className="inspection-request-page">
      <section className="inspection-summary" aria-label="Сводка обхода">
        <div className="inspection-summary__meta">
          <span className="inspection-summary__badge">
            <span className="inspection-summary__badge-icon" aria-hidden="true">
              i
            </span>
            {inspectionRequest.reason}
          </span>

          <Text className="inspection-summary__date">
            {inspectionRequest.date}
          </Text>
          <span className="inspection-summary__separator" aria-hidden="true">
            •
          </span>
          <Text className="inspection-summary__time">
            {inspectionRequest.time}
          </Text>
        </div>

        <div className="inspection-summary__progress">
          <Progress
            percent={progressPercent}
            showInfo={false}
            strokeColor="#2497f2"
            trailColor="#e7e9ed"
          />
          <Text className="inspection-summary__progress-text">
            {inspectionRequest.completedTasks}/{inspectionRequest.totalTasks}{' '}
            задач
          </Text>
        </div>
      </section>

      <section className="inspection-tasks" aria-labelledby="tasks-title">
        <div className="inspection-tasks__header">
          <Title id="tasks-title" level={3} className="inspection-tasks__title">
            Задачи
          </Title>
          <Text className="inspection-tasks__count">
            {inspectionRequest.totalTasks} задач
          </Text>
        </div>

        <div className="inspection-tasks__list">
          {inspectionRequest.tasks.map((task) => (
            <button
              className={`inspection-task ${
                task.status === 'current' ? 'inspection-task--current' : ''
              }`}
              key={task.id}
              type="button"
              onClick={() => navigate(`/inspector/tasks/${task.id}`)}
            >
              <span className="inspection-task__content">
                <Text className="inspection-task__title">{task.title}</Text>
                <span className="inspection-task__meta">
                  <span
                    className={`inspection-task__status-dot ${
                      taskStatusClassName[task.status]
                    }`}
                    aria-hidden="true"
                  />
                  <Text className="inspection-task__status">
                    {task.statusLabel}
                  </Text>
                  <span className="inspection-task__meta-separator" />
                  <Text className="inspection-task__workshop">
                    {task.workshop}
                  </Text>
                </span>
              </span>

              <span className="inspection-task__chevron" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      <footer
        className={`inspection-bottom-action ${
          isPageBottomReached ? 'inspection-bottom-action--no-shadow' : ''
        }`}
      >
        <Button
          type="primary"
          size="large"
          block
          onClick={() => navigate('/inspector/tasks/task-1')}
        >
          Перейти к текущей задаче
        </Button>
      </footer>
    </main>
  )
}
