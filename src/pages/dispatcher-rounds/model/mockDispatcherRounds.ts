export type DispatcherRoundType = "planned" | "incident";

export type DispatcherRound = {
  id: string;
  number: string;
  type: DispatcherRoundType;
  tasksCount: number;
  executor: {
    name: string;
    avatarUrl: string;
  };
  date: string;
  plannedTime: string;
};

export const roundTypeLabels: Record<DispatcherRoundType, string> = {
  planned: "Плановый обход",
  incident: "Инцидент",
};

export const dispatcherRounds: DispatcherRound[] = [
  {
    id: "round-1",
    number: "AT-00001",
    type: "planned",
    tasksCount: 10,
    executor: {
      name: "Петров Пётр Петрович",
      avatarUrl: "https://i.pravatar.cc/80?img=12",
    },
    date: "20 апреля 2026",
    plannedTime: "12:00",
  },
  {
    id: "round-2",
    number: "AT-00002",
    type: "incident",
    tasksCount: 15,
    executor: {
      name: "Петров Пётр Петрович",
      avatarUrl: "https://i.pravatar.cc/80?img=12",
    },
    date: "21 апреля 2026",
    plannedTime: "13:00",
  },
  {
    id: "round-3",
    number: "AT-00003",
    type: "planned",
    tasksCount: 20,
    executor: {
      name: "Петров Пётр Петрович",
      avatarUrl: "https://i.pravatar.cc/80?img=12",
    },
    date: "20 мая 2026",
    plannedTime: "14:00",
  },
  {
    id: "round-4",
    number: "AT-00004",
    type: "planned",
    tasksCount: 143,
    executor: {
      name: "Петров Пётр Петрович",
      avatarUrl: "https://i.pravatar.cc/80?img=12",
    },
    date: "20 декабря 2026",
    plannedTime: "15:00",
  },
  {
    id: "round-5",
    number: "AT-00005",
    type: "incident",
    tasksCount: 14,
    executor: {
      name: "Петров Пётр Петрович",
      avatarUrl: "https://i.pravatar.cc/80?img=12",
    },
    date: "17 апреля 2026",
    plannedTime: "17:00",
  },
  {
    id: "round-6",
    number: "AT-00006",
    type: "planned",
    tasksCount: 13,
    executor: {
      name: "Петров Пётр Петрович",
      avatarUrl: "https://i.pravatar.cc/80?img=12",
    },
    date: "20 сентября 2026",
    plannedTime: "18:00",
  },
];
