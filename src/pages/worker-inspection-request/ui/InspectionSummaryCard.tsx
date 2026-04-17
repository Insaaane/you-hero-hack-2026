import { InfoCircleOutlined } from '@ant-design/icons'
import { Card, Divider, Flex, Progress, Tag, Typography } from 'antd'

const { Text } = Typography

type InspectionSummaryCardProps = {
  reason: string
  date: string
  time: string
  completedTasks: number
  totalTasks: number
}

export function InspectionSummaryCard({
  reason,
  date,
  time,
  completedTasks,
  totalTasks,
}: InspectionSummaryCardProps) {
  const progressPercent = (completedTasks / totalTasks) * 100

  return (
    <Card
      className="inspection-summary"
      variant="borderless"
      styles={{ body: { padding: 0 } }}
      aria-label="Сводка обхода"
    >
      <Flex vertical>
        <Flex align="center" gap={8} wrap>
          <Tag
            color="error"
            icon={<InfoCircleOutlined />}
            className="inspection-summary__tag"
          >
            {reason}
          </Tag>
          <Text type="secondary">•</Text>
          <Flex align="center" gap={8} className="inspection-summary__datetime">
            <Text className="inspection-summary__date">{date}</Text>
            <Text type="secondary">•</Text>
            <Text className="inspection-summary__time">{time}</Text>
          </Flex>
        </Flex>

        <Divider className="inspection-summary__divider" />

        <Flex align="center" gap={12}>
          <Progress
            className="inspection-summary__progress"
            percent={progressPercent}
            showInfo={false}
            strokeColor="#2497f2"
            railColor="#e7e9ed"
          />
          <Text className="inspection-summary__progress-text">
            {completedTasks}/{totalTasks} задач
          </Text>
        </Flex>
      </Flex>
    </Card>
  )
}
