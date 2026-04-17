import { type KeyboardEvent } from "react";
import { RightOutlined } from "@ant-design/icons";
import { Badge, Card, Flex, Space, Tag, Typography } from "antd";
import type { InspectionTask } from "../model/mockInspectionRequest";

const { Text } = Typography;

const taskStatusColor: Record<InspectionTask["status"], string> = {
  checked: "#52c41a",
  critical: "#ff4d4f",
  pending: "#d9d9d9",
};

function isActivationKey(event: KeyboardEvent<HTMLElement>) {
  return event.key === "Enter" || event.key === " ";
}

type InspectionTaskCardProps = {
  task: InspectionTask;
  onOpen: (taskId: string) => void;
};

export function InspectionTaskCard({ task, onOpen }: InspectionTaskCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isActivationKey(event)) {
      return;
    }

    event.preventDefault();
    onOpen(task.id);
  };

  return (
    <Card
      hoverable
      tabIndex={0}
      role="button"
      className={`inspection-task-card ${
        task.marker ? "inspection-task-card--next" : ""
      }`}
      styles={{ body: { padding: 0 } }}
      onClick={() => onOpen(task.id)}
      onKeyDown={handleKeyDown}
    >
      {task.marker && (
        <Tag
          color="blue"
          variant="solid"
          className="inspection-task-card__marker"
        >
          {task.marker}
        </Tag>
      )}

      <Flex
        align="center"
        justify="space-between"
        gap={12}
        className="inspection-task-card__row"
      >
        <Space
          orientation="vertical"
          size={8}
          className="inspection-task-card__content"
        >
          <Text className="inspection-task-card__title">{task.title}</Text>

          <Flex
            align="center"
            gap={8}
            className="inspection-task-card__meta-row"
            wrap
          >
            <Badge
              color={taskStatusColor[task.status]}
              className="inspection-task-card__status"
              text={
                <Text className="inspection-task-card__meta">
                  {task.statusLabel}
                </Text>
              }
            />
            <Text type="secondary" className="inspection-task-card__dot">
              •
            </Text>
            <Text className="inspection-task-card__workshop">
              {task.workshop}
            </Text>

            {task.defect && (
              <>
                <Text type="secondary" className="inspection-task-card__dot">
                  •
                </Text>
                <Text className="inspection-task-card__defect">
                  Найдены дефекты
                </Text>
              </>
            )}
          </Flex>
        </Space>

        <RightOutlined className="inspection-task-card__icon" />
      </Flex>
    </Card>
  );
}
