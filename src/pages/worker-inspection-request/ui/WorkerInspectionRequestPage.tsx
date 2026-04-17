import { useNavigate } from "react-router";
import { useIsPageBottomReached } from "@/shared/lib/viewport";
import { inspectionRequest } from "../model/mockInspectionRequest";
import { InspectionBottomAction } from "./InspectionBottomAction";
import { InspectionSummaryCard } from "./InspectionSummaryCard";
import { InspectionTasksSection } from "./InspectionTasksSection";

export function WorkerInspectionRequestPage() {
  const navigate = useNavigate();
  const isPageBottomReached = useIsPageBottomReached();

  const openTask = (taskId: string) => {
    navigate(`/inspector/tasks/${taskId}`);
  };

  return (
    <main className="inspection-request-page">
      <InspectionSummaryCard
        reason={inspectionRequest.reason}
        date={inspectionRequest.date}
        time={inspectionRequest.time}
        completedTasks={inspectionRequest.completedTasks}
        totalTasks={inspectionRequest.totalTasks}
      />

      <InspectionTasksSection
        tasks={inspectionRequest.tasks}
        totalTasks={inspectionRequest.totalTasks}
        onOpenTask={openTask}
      />

      <InspectionBottomAction
        isPageBottomReached={isPageBottomReached}
        onGoToCurrentTask={() => openTask("task-1")}
      />
    </main>
  );
}
