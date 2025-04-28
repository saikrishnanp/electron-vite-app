/* eslint-disable prettier/prettier */
import { DragOverlay } from "@dnd-kit/core";

import { TestPlanRow } from "./TestplanRow";
import { Step } from "./types";

interface ITestPlanOverlayProps {
  draggedItem: Step | null;
}

export const TestPlanOverlay = ({ draggedItem }: ITestPlanOverlayProps): JSX.Element => {
  return (
    <DragOverlay>
      {draggedItem && (
        <TestPlanRow
          isRowActive={false}
          step={draggedItem}
          sectionId={draggedItem.id}
          handleDeleteRow={() => {}}
          handleDuplicateRow={() => {}}
          handleEditCell={() => {}}
          handleRowClick={() => {}}
        />
      )}
    </DragOverlay>
  );
};
