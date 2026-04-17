import { Button, Card } from "antd";

type InspectionBottomActionProps = {
  isPageBottomReached: boolean;
  onGoToCurrentTask: () => void;
};

export function InspectionBottomAction({
  isPageBottomReached,
  onGoToCurrentTask,
}: InspectionBottomActionProps) {
  return (
    <Card
      className={`inspection-bottom-action ${
        isPageBottomReached ? "inspection-bottom-action--no-shadow" : ""
      }`}
      variant="borderless"
      styles={{ body: { padding: 0 } }}
    >
      <Button
        type="primary"
        size="large"
        block
        onClick={onGoToCurrentTask}
      >
        Перейти к текущей задаче
      </Button>
    </Card>
  );
}
