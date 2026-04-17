import { Button, Card, Flex, Modal, Space, Typography } from "antd";
import {
  inspectionReadingConfigs,
  type InspectionReadingViolation,
} from "@/entities/inspection";

type TaskDeviationModalProps = {
  open: boolean;
  violations: InspectionReadingViolation[];
  onReview: () => void;
  onSubmitRequest: () => void;
};

function formatNumber(value: number) {
  return Number.isInteger(value)
    ? String(value)
    : String(value).replace(".", ",");
}

function getViolationUnit(violation: InspectionReadingViolation) {
  return (
    inspectionReadingConfigs.find((config) => config.key === violation.key)
      ?.unit ?? ""
  );
}

function getViolationLimitText(violation: InspectionReadingViolation) {
  const unit = getViolationUnit(violation);

  if (typeof violation.max === "number") {
    return `Максимум: ${formatNumber(violation.max)} ${unit}`;
  }

  return `Минимум: ${formatNumber(violation.min ?? 0)} ${unit}`;
}

function getViolationDeltaText(violation: InspectionReadingViolation) {
  if (typeof violation.max === "number") {
    return `↑ ${formatNumber(violation.value - violation.max)}`;
  }

  return `↓ ${formatNumber((violation.min ?? 0) - violation.value)}`;
}

export function TaskDeviationModal({
  open,
  violations,
  onReview,
  onSubmitRequest,
}: TaskDeviationModalProps) {
  return (
    <Modal
      centered
      open={open}
      width="100%"
      title="Обнаружено отклонение"
      className="task-deviation-modal"
      footer={
        <Flex justify="end" gap={18} className="task-deviation-modal__footer">
          <Button type="text" onClick={onReview}>
            Проверить показатели
          </Button>
          <Button type="text" danger onClick={onSubmitRequest}>
            Отправить заявку
          </Button>
        </Flex>
      }
      onCancel={onReview}
    >
      <Space
        orientation="vertical"
        size={12}
        className="task-deviation-modal__body"
      >
        <Typography.Paragraph className="task-deviation-modal__text">
          При проверке данных было обнаружено критическое отклонение от
          референсных значений следующий показателей:
        </Typography.Paragraph>

        <Space
          orientation="vertical"
          size={12}
          className="task-deviation-modal__list"
        >
          {violations.map((violation) => {
            const unit = getViolationUnit(violation);

            return (
              <Card
                key={violation.key}
                className="task-deviation-modal__item"
                styles={{ body: { padding: 14 } }}
              >
                <Typography.Text className="task-deviation-modal__item-title">
                  {violation.label}
                </Typography.Text>

                <Flex align="center" gap={8} wrap={false}>
                  <Typography.Text className="task-deviation-modal__value">
                    {formatNumber(violation.value)} {unit}
                  </Typography.Text>
                  <Typography.Text
                    type="danger"
                    className="task-deviation-modal__delta"
                  >
                    {getViolationDeltaText(violation)}
                  </Typography.Text>
                  <Typography.Text type="secondary">|</Typography.Text>
                  <Typography.Text type="secondary">
                    {getViolationLimitText(violation)}
                  </Typography.Text>
                </Flex>
              </Card>
            );
          })}
        </Space>

        <Typography.Paragraph className="task-deviation-modal__text">
          Проверьте показатели на наличие ошибки или отправьте заявку на
          техобслуживание объекта
        </Typography.Paragraph>
      </Space>
    </Modal>
  );
}
