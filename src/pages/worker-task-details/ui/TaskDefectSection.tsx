import {
  DeleteOutlined,
  EditOutlined,
  FileSearchOutlined,
  MoreOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  Empty,
  Flex,
  Image,
  Space,
  Typography,
  type MenuProps,
} from "antd";
import type { InspectionDefectInfo } from "@/entities/inspection";

type TaskDefectSectionProps = {
  defects: InspectionDefectInfo[];
  canManage: boolean;
  onAdd: () => void;
  onEdit: (defectIndex: number) => void;
  onDelete: (defectIndex: number) => void;
};

export function TaskDefectSection({
  defects,
  canManage,
  onAdd,
  onEdit,
  onDelete,
}: TaskDefectSectionProps) {
  const hasDefects = defects.length > 0;
  const menuItems: MenuProps["items"] = [
    {
      key: "edit",
      label: "Редактировать",
      icon: <EditOutlined />,
    },
    {
      key: "delete",
      label: "Удалить",
      danger: true,
      icon: <DeleteOutlined />,
    },
  ];

  const handleMenuClick = (
    defectIndex: number,
    { key }: Parameters<NonNullable<MenuProps["onClick"]>>[0],
  ) => {
    if (key === "edit") {
      onEdit(defectIndex);
      return;
    }

    onDelete(defectIndex);
  };

  return (
    <section className="task-defect-section">
      <Flex
        align="center"
        justify="space-between"
        gap={16}
        className="task-defect-section__header"
      >
        <Typography.Title level={3} className="task-defect-section__title">
          Дефекты
        </Typography.Title>

        {canManage && (
          <Button
            type="link"
            danger
            className="task-defect-section__add"
            onClick={onAdd}
          >
            Добавить дефект
          </Button>
        )}
      </Flex>

      {!hasDefects ? (
        <Empty
          className="task-defect-section__empty"
          image={
            <span className="task-defect-section__empty-icon">
              <FileSearchOutlined />
            </span>
          }
          description="Дефекты не добавлены"
        />
      ) : (
        <Space
          orientation="vertical"
          size={12}
          className="task-defect-section__list"
        >
          {defects.map((defect, defectIndex) => (
            <div
              key={`${defect.title}-${defectIndex}`}
              className="task-defect-section__content"
            >
              {canManage && (
                <Dropdown
                  menu={{
                    items: menuItems,
                    onClick: (event) => handleMenuClick(defectIndex, event),
                  }}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <Button
                    type="text"
                    className="task-defect-section__menu"
                    aria-label="Действия с дефектом"
                    icon={<MoreOutlined />}
                  />
                </Dropdown>
              )}

              <Typography.Text className="task-defect-section__defect-title">
                {defect.title}
              </Typography.Text>

              <Typography.Text
                type="secondary"
                className="task-defect-section__label"
              >
                Комментарий
              </Typography.Text>

              <Card
                className="task-defect-section__comment"
                variant="borderless"
                styles={{ body: { padding: 12 } }}
              >
                <Typography.Paragraph className="task-defect-section__comment-text">
                  {defect.comment}
                </Typography.Paragraph>
              </Card>

              <Card
                className="task-defect-section__photos"
                styles={{ body: { padding: 16 } }}
              >
                <Flex align="center" justify="space-between" gap={12}>
                  <Typography.Text className="task-defect-section__photos-title">
                    Фотоотчет
                  </Typography.Text>
                  <RightOutlined className="task-defect-section__photos-icon" />
                </Flex>

                <Flex gap={8} className="task-defect-section__photo-grid">
                  {defect.photos.map((photo) => (
                    <div key={photo.id} className="task-defect-section__photo-item">
                      <Image
                        preview={false}
                        src={photo.src}
                        alt={photo.alt}
                        className="task-defect-section__photo"
                      />
                    </div>
                  ))}
                </Flex>
              </Card>
            </div>
          ))}
        </Space>
      )}
    </section>
  );
}
