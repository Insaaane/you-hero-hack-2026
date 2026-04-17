import { Fragment } from "react";
import { Card, Divider, Flex, Space, Typography } from "antd";
import type { InspectionTask } from "../model/mockInspectionRequest";
import { InspectionTaskCard } from "./InspectionTaskCard";

const { Text, Title } = Typography;

type InspectionTasksSectionProps = {
  tasks: InspectionTask[];
  totalTasks: number;
  onOpenTask: (taskId: string) => void;
};

export function InspectionTasksSection({
  tasks,
  totalTasks,
  onOpenTask,
}: InspectionTasksSectionProps) {
  return (
    <Card
      className="inspection-tasks"
      variant="borderless"
      styles={{ body: { padding: 0 } }}
    >
      <Flex align="center" justify="space-between" gap={16}>
        <Title id="tasks-title" level={3} className="inspection-tasks__title">
          Задачи
        </Title>
        <Text type="secondary" className="inspection-tasks__count">
          {totalTasks} задач
        </Text>
      </Flex>

      <section aria-labelledby="tasks-title">
        <Space
          orientation="vertical"
          size={16}
          className="inspection-tasks__list"
        >
          {tasks.map((task) => (
            <Fragment key={task.id}>
              <InspectionTaskCard task={task} onOpen={onOpenTask} />

              {task.status === "current" && (
                <Divider className="inspection-tasks__divider" />
              )}
            </Fragment>
          ))}
        </Space>
      </section>
    </Card>
  );
}
