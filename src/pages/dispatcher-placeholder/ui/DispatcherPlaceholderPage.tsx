import { Empty, Typography } from "antd";

type DispatcherPlaceholderPageProps = {
  title: string;
  description: string;
};

export function DispatcherPlaceholderPage({
  title,
  description,
}: DispatcherPlaceholderPageProps) {
  return (
    <main className="dispatcher-placeholder-page">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <Typography.Text type="secondary">{description}</Typography.Text>
        }
      >
        <Typography.Title level={2} className="dispatcher-placeholder-page__title">
          {title}
        </Typography.Title>
      </Empty>
    </main>
  );
}
