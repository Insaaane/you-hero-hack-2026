import { Button, Flex, Modal, Typography } from "antd";
import type { InspectionDefectInfo } from "@/entities/inspection";

type TaskDeleteDefectConfirmModalProps = {
  open: boolean;
  defect?: InspectionDefectInfo;
  onCancel: () => void;
  onConfirm: () => void;
};

export function TaskDeleteDefectConfirmModal({
  open,
  defect,
  onCancel,
  onConfirm,
}: TaskDeleteDefectConfirmModalProps) {
  return (
    <Modal
      centered
      open={open}
      width="100%"
      title="Удаление дефекта"
      className="task-delete-defect-modal"
      footer={
        <Flex justify="end" gap={18} className="task-delete-defect-modal__footer">
          <Button type="text" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="text" danger onClick={onConfirm}>
            Удалить дефект
          </Button>
        </Flex>
      }
      onCancel={onCancel}
    >
      <Typography.Paragraph className="task-delete-defect-modal__text">
        Вы уверены, что хотите удалить дефект {defect?.title ?? "без названия"}?
        Это действие необратимо, удалив дефект, вы потеряете все введенные
        данные.
      </Typography.Paragraph>
    </Modal>
  );
}
