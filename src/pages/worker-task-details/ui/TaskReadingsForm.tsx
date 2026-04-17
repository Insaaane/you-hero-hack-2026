import { Form, Input, Typography, type FormInstance } from 'antd'
import { inspectionReadingConfigs } from '@/entities/inspection'
import type { ReadingFormValues } from '../lib/readings'

type TaskReadingsFormProps = {
  form: FormInstance<ReadingFormValues>
  initialValues: ReadingFormValues
  disabled: boolean
  showRequiredMarks: boolean
}

export function TaskReadingsForm({
  form,
  initialValues,
  disabled,
  showRequiredMarks,
}: TaskReadingsFormProps) {
  return (
    <Form
      form={form}
      initialValues={initialValues}
      layout="vertical"
      requiredMark={false}
      className="task-detail-form"
    >
      {inspectionReadingConfigs.map((config) => (
        <Form.Item
          key={config.key}
          name={config.key}
          className="task-detail-form__item"
          label={
            <span>
              {config.label}
              {showRequiredMarks && (
                <Typography.Text type="danger"> *</Typography.Text>
              )}
            </span>
          }
        >
          <Input
            size="large"
            disabled={disabled}
            placeholder={config.placeholder}
            suffix={
              <Typography.Text className="task-detail-form__suffix">
                {config.unit}
              </Typography.Text>
            }
            inputMode="decimal"
          />
        </Form.Item>
      ))}
    </Form>
  )
}
