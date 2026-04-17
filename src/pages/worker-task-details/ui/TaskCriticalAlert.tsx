import { Alert, Space, Typography } from 'antd'
import type { InspectionReadingViolation } from '@/entities/inspection'

type TaskCriticalAlertProps = {
  violations: InspectionReadingViolation[]
}

function getViolationText(violation: InspectionReadingViolation) {
  if (typeof violation.max === 'number') {
    return `${violation.label}. Указано: ${violation.value}, максимум: ${violation.max}`
  }

  return `${violation.label}. Указано: ${violation.value}, минимум: ${violation.min}`
}

export function TaskCriticalAlert({ violations }: TaskCriticalAlertProps) {
  return (
    <Alert
      type="error"
      showIcon
      className="task-detail__critical-alert"
      title={<Typography.Text strong>Критическое отклонение</Typography.Text>}
      description={
        <Space orientation="vertical" size={2}>
          <Typography.Text>Превышено значение показателей:</Typography.Text>
          {violations.map((violation) => (
            <Typography.Text key={violation.key}>
              {getViolationText(violation)}
            </Typography.Text>
          ))}
        </Space>
      }
    />
  )
}
