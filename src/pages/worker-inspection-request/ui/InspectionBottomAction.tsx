import { Button, Card } from "antd";

type InspectionBottomActionProps = {
  isPageBottomReached: boolean;
  onGoToNextTask: () => void;
};

export function InspectionBottomAction({
  isPageBottomReached,
  onGoToNextTask,
}: InspectionBottomActionProps) {
  return (
    <Card
      className={`inspection-bottom-action ${
        isPageBottomReached ? "inspection-bottom-action--no-shadow" : ""
      }`}
      variant="borderless"
      styles={{ body: { padding: 0 } }}
    >
      <Button type="primary" size="large" block onClick={onGoToNextTask}>
        Перейти к следующей задаче
      </Button>
    </Card>
  );
}
