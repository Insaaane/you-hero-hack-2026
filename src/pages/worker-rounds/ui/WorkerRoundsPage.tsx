import { RightOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import {
  Badge,
  Card,
  Empty,
  Flex,
  Progress,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import { useNavigate } from "react-router";
import {
  roundTypeLabels,
  useGetRoundsQuery,
  useGetTasksQuery,
  type InspectionRound,
  type InspectionTask,
} from "@/entities/inspection";

const { Text, Title } = Typography;

const roundStatusLabels: Record<InspectionRound["status"], string> = {
  active: "В работе",
  completed: "Завершен",
  planned: "Запланирован",
};

const roundStatusColors: Record<InspectionRound["status"], string> = {
  active: "#1677ff",
  completed: "#52c41a",
  planned: "#d9d9d9",
};

type RoundProgress = {
  completedTasks: number;
  totalTasks: number;
};

function getRoundsProgress(tasks: InspectionTask[]) {
  return tasks.reduce<Record<string, RoundProgress>>(
    (progressByRoundId, task) => {
      const progress = progressByRoundId[task.roundId] ?? {
        completedTasks: 0,
        totalTasks: 0,
      };

      progressByRoundId[task.roundId] = {
        completedTasks:
          progress.completedTasks + Number(task.status !== "pending"),
        totalTasks: progress.totalTasks + 1,
      };

      return progressByRoundId;
    },
    {},
  );
}

function WorkerRoundCard({
  round,
  progress,
  onOpen,
}: {
  round: InspectionRound;
  progress: RoundProgress;
  onOpen: (roundId: string) => void;
}) {
  const progressPercent =
    progress.totalTasks > 0
      ? (progress.completedTasks / progress.totalTasks) * 100
      : 0;

  return (
    <Card
      hoverable
      role="button"
      tabIndex={0}
      className="worker-round-card"
      styles={{ body: { padding: 16 } }}
      onClick={() => onOpen(round.id)}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") {
          return;
        }

        event.preventDefault();
        onOpen(round.id);
      }}
    >
      <Flex align="start" justify="space-between" gap={12}>
        <Space
          orientation="vertical"
          size={10}
          className="worker-round-card__content"
        >
          <Flex align="center" gap={8} wrap>
            <Text className="worker-round-card__number">{round.number}</Text>
            <Tag
              color={round.type === "incident" ? "error" : undefined}
              className="worker-round-card__tag"
            >
              {roundTypeLabels[round.type]}
            </Tag>
          </Flex>

          <Flex align="center" gap={8} wrap className="worker-round-card__meta">
            <Text>{round.date}</Text>
            <Text type="secondary">•</Text>
            <Text>{round.time}</Text>
          </Flex>

          <Badge
            color={roundStatusColors[round.status]}
            text={
              <Text className="worker-round-card__status">
                {roundStatusLabels[round.status]}
              </Text>
            }
          />

          <Flex align="center" gap={12}>
            <Progress
              percent={progressPercent}
              showInfo={false}
              strokeColor="#2497f2"
              railColor="#e7e9ed"
              className="worker-round-card__progress"
            />
            <Text className="worker-round-card__progress-text">
              {progress.completedTasks}/{progress.totalTasks}
            </Text>
          </Flex>
        </Space>

        <RightOutlined className="worker-round-card__icon" />
      </Flex>
    </Card>
  );
}

export function WorkerRoundsPage() {
  const navigate = useNavigate();
  const {
    data: rounds = [],
    isLoading: isRoundsLoading,
    isError: isRoundsError,
  } = useGetRoundsQuery();
  const {
    data: tasks = [],
    isLoading: isTasksLoading,
    isError: isTasksError,
  } = useGetTasksQuery();
  const progressByRoundId = useMemo(() => getRoundsProgress(tasks), [tasks]);
  const isLoading = isRoundsLoading || isTasksLoading;
  const isError = isRoundsError || isTasksError;

  const openRound = (roundId: string) => {
    navigate(`/inspector/rounds/${roundId}`);
  };

  return (
    <main className="worker-rounds-page">
      <Flex
        align="center"
        justify="space-between"
        gap={16}
        style={{ marginBottom: 16 }}
      >
        <Title level={1} className="worker-rounds-page__title">
          Все обходы
        </Title>
        <Text type="secondary">{rounds.length} обходов</Text>
      </Flex>

      {isLoading && (
        <Card style={{ display: "flex", justifyContent: "center" }}>
          <Spin tip="Загружаем обходы" />
        </Card>
      )}

      {!isLoading && isError && (
        <Card>
          <Empty description="Не удалось загрузить список обходов" />
        </Card>
      )}

      {!isLoading && !isError && (
        <Space
          orientation="vertical"
          size={12}
          className="worker-rounds-page__list"
        >
          {rounds.map((round) => (
            <WorkerRoundCard
              key={round.id}
              round={round}
              progress={
                progressByRoundId[round.id] ?? {
                  completedTasks: 0,
                  totalTasks: 0,
                }
              }
              onOpen={openRound}
            />
          ))}
        </Space>
      )}
    </main>
  );
}
