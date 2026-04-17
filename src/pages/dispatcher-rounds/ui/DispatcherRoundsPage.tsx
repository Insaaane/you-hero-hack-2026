import { useEffect, useMemo, useState } from "react";
import {
  CheckCircleOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Button,
  Dropdown,
  Empty,
  Flex,
  Table,
  Tabs,
  Tag,
  Typography,
  type MenuProps,
  type TableColumnsType,
} from "antd";
import { useLocation, useNavigate } from "react-router";
import {
  dispatcherRounds,
  roundTypeLabels,
  type DispatcherRound,
  type DispatcherRoundType,
} from "../model/mockDispatcherRounds";

type DispatcherRoundsTab = "planned" | "active" | "completed";

type DispatcherRoundsLocationState = {
  savedRound?: DispatcherRound;
  roundSaveMode?: "create" | "edit";
};

const roundTypeView: Record<
  DispatcherRoundType,
  { label: string; className: string }
> = {
  planned: {
    label: roundTypeLabels.planned,
    className: "dispatcher-round-type-tag--planned",
  },
  incident: {
    label: roundTypeLabels.incident,
    className: "dispatcher-round-type-tag--incident",
  },
};

const tableLocale = {
  filterConfirm: "Ок",
  filterReset: "Сбросить",
  filterEmptyText: "Нет фильтров",
};

function getDateTimestamp(date: string) {
  const monthNumbers: Record<string, number> = {
    января: 0,
    февраля: 1,
    марта: 2,
    апреля: 3,
    мая: 4,
    июня: 5,
    июля: 6,
    августа: 7,
    сентября: 8,
    октября: 9,
    ноября: 10,
    декабря: 11,
  };
  const [day, month, year] = date.split(" ");

  return new Date(
    Number(year),
    monthNumbers[month] ?? 0,
    Number(day),
  ).getTime();
}

function getColumns(onEdit: (round: DispatcherRound) => void): TableColumnsType<DispatcherRound> {
  return [
    {
      title: "№",
      dataIndex: "number",
      width: 110,
      sorter: (firstRound, secondRound) =>
        firstRound.number.localeCompare(secondRound.number),
    },
    {
      title: "Тип обхода",
      dataIndex: "type",
      width: 220,
      filters: [
        { text: roundTypeLabels.planned, value: "planned" },
        { text: roundTypeLabels.incident, value: "incident" },
      ],
      onFilter: (value, round) => round.type === value,
      render: (type: DispatcherRoundType) => {
        const typeView = roundTypeView[type];

        return (
          <Tag className={`dispatcher-round-type-tag ${typeView.className}`}>
            {type === "incident" && <ExclamationCircleOutlined />}
            {typeView.label}
          </Tag>
        );
      },
    },
    {
      title: "Количество задач",
      dataIndex: "tasksCount",
      width: 200,
      sorter: (firstRound, secondRound) =>
        firstRound.tasksCount - secondRound.tasksCount,
    },
    {
      title: "Исполнитель",
      dataIndex: ["executor", "name"],
      width: 290,
      filters: [{ text: "Петров Пётр Петрович", value: "Петров Пётр Петрович" }],
      onFilter: (value, round) => round.executor.name === value,
      render: (_, round) => (
        <Flex align="center" gap={12} wrap={false}>
          <Avatar
            size={26}
            src={round.executor.avatarUrl}
            className="dispatcher-rounds-table__avatar"
          >
            ПП
          </Avatar>
          <Typography.Text className="dispatcher-rounds-table__executor">
            {round.executor.name}
          </Typography.Text>
        </Flex>
      ),
    },
    {
      title: "Дата",
      dataIndex: "date",
      width: 190,
      sorter: (firstRound, secondRound) =>
        getDateTimestamp(firstRound.date) - getDateTimestamp(secondRound.date),
    },
    {
      title: "Планируемое время",
      dataIndex: "plannedTime",
      width: 170,
      sorter: (firstRound, secondRound) =>
        firstRound.plannedTime.localeCompare(secondRound.plannedTime),
    },
    {
      title: "",
      key: "actions",
      width: 48,
      align: "center",
      render: (_, round) => {
        const menuItems: MenuProps["items"] = [
          {
            key: "edit",
            label: "Редактировать",
            icon: <EditOutlined />,
          },
        ];

        return (
          <Dropdown
            menu={{
              items: menuItems,
              onClick: ({ key }) => {
                if (key === "edit") {
                  onEdit(round);
                }
              },
            }}
            trigger={["click"]}
          >
            <Button
              type="text"
              aria-label="Действия с обходом"
              icon={<MoreOutlined />}
              className="dispatcher-rounds-table__action"
            />
          </Dropdown>
        );
      },
    },
  ];
}

function DispatcherRoundsPlaceholder({ title }: { title: string }) {
  return (
    <div className="dispatcher-rounds-page__placeholder">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <Typography.Text type="secondary">
            Раздел “{title}” появится после подключения рабочих процессов MVP.
          </Typography.Text>
        }
      />
    </div>
  );
}

export function DispatcherRoundsPage() {
  const [activeTab, setActiveTab] =
    useState<DispatcherRoundsTab>("planned");
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as DispatcherRoundsLocationState | null;
  const [successAlert, setSuccessAlert] = useState(() => {
    if (!locationState?.savedRound) {
      return null;
    }

    return {
      title:
        locationState.roundSaveMode === "edit"
          ? "Обход обновлен"
          : "Обход создан",
      description:
        locationState.roundSaveMode === "edit"
          ? `Данные обхода ${locationState.savedRound.number} обновлены`
          : `Обход ${locationState.savedRound.number} добавлен в список`,
    };
  });
  const dataSource = useMemo(() => {
    const savedRound = locationState?.savedRound;

    if (!savedRound) {
      return dispatcherRounds;
    }

    const hasSavedRound = dispatcherRounds.some((round) => round.id === savedRound.id);

    if (hasSavedRound) {
      return dispatcherRounds.map((round) =>
        round.id === savedRound.id ? savedRound : round,
      );
    }

    return [savedRound, ...dispatcherRounds];
  }, [locationState?.savedRound]);
  const columns = useMemo(
    () =>
      getColumns((round) =>
        navigate(`/dispatcher/rounds/${round.id}/edit`, {
          state: { round },
        }),
      ),
    [navigate],
  );

  useEffect(() => {
    if (!successAlert) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setSuccessAlert(null);
    }, 5000);

    return () => window.clearTimeout(timerId);
  }, [successAlert]);

  return (
    <main className="dispatcher-rounds-page">
      {successAlert && (
        <Alert
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
          closable={{ onClose: () => setSuccessAlert(null) }}
          className="dispatcher-success-alert"
          title={successAlert.title}
          description={successAlert.description}
        />
      )}

      <section className="dispatcher-rounds-page__header">
        <Flex
          align="center"
          justify="space-between"
          gap={24}
          className="dispatcher-rounds-page__toolbar"
        >
          <Typography.Title level={1} className="dispatcher-rounds-page__title">
            Обходы
          </Typography.Title>

          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate("/dispatcher/rounds/new")}
          >
            Создать обход
          </Button>
        </Flex>

        <Tabs
          activeKey={activeTab}
          className="dispatcher-rounds-page__tabs"
          items={[
            { key: "planned", label: "Запланированы" },
            { key: "active", label: "В работе" },
            { key: "completed", label: "Завершены" },
          ]}
          onChange={(key) => setActiveTab(key as DispatcherRoundsTab)}
        />
      </section>

      <section className="dispatcher-rounds-page__body">
        {activeTab === "planned" ? (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            locale={tableLocale}
            rowSelection={{}}
            showSorterTooltip={false}
            scroll={{ x: 1230 }}
            className="dispatcher-rounds-table"
          />
        ) : (
          <DispatcherRoundsPlaceholder
            title={activeTab === "active" ? "В работе" : "Завершены"}
          />
        )}
      </section>
    </main>
  );
}
