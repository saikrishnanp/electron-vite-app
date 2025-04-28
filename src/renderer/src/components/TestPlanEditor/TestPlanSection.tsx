/* eslint-disable prettier/prettier */
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { VscodeButton } from "@vscode-elements/react-elements";

import { TestPlanRow } from "./TestplanRow";

import { isStepVisible } from "./utils";

import { Step, TestStepSection } from "./types";

import "./TestPlanEditor.css";

interface ITestPlanSectionProps {
  section: TestStepSection;
  activeRows: Step[] | null;
  collapsedSteps: string[];
  rowIdToShowBorder: string | null;
  isFullScreen: boolean;
  handlePaste: (
    e: React.ClipboardEvent<HTMLDivElement>,
    sectionId: string
  ) => void;
  handleAddRow: (
    sectionId: string,
    stepData: Step | null,
    insertNextToRowId?: string | null
  ) => void;
  handleDeleteRow: (sectionId: string, rowId: string) => void;
  handleDuplicateRow: (step: Step, sectionId: string) => void;
  handleEditCell: (
    sectionId: string,
    stepId: string,
    key: string,
    value: string | boolean
  ) => void;
  toggleCollapse: (stepId: string) => void;
  handleRowClick: (row: Step, e: React.MouseEvent) => void;
}

export const TestPlanSection = ({
  section,
  activeRows,
  collapsedSteps,
  rowIdToShowBorder,
  isFullScreen,
  handlePaste,
  handleAddRow,
  handleDeleteRow,
  handleDuplicateRow,
  handleRowClick,
  handleEditCell,
  toggleCollapse,
}: ITestPlanSectionProps): JSX.Element => {
  const visibleSteps = section.steps.filter((step, index) =>
    isStepVisible(step, index, section.steps, collapsedSteps)
  );

  // Ref for the parent container
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: visibleSteps.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Height of each row
    overscan: 5, // Render extra rows for smoother scrolling
  });

  return (
      <SortableContext
        key={section.id}
        items={visibleSteps.map((step) => step.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          className={clsx("border border-white rounded-md p-2 mb-2", {
            ["w-xl"]: !isFullScreen,
            ["w-full"]: isFullScreen
          })}
          onPaste={(e) => handlePaste(e, section.id)}
        >
          <div className="flex justify-between items-center mb-2">
            <div className={"sectionDescription"}>
              <h6>{section.id}</h6>
              <ul>
                {section.descriptionPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
            <VscodeButton
              className="p-1 rounded-sm"
              type="button"
              onClick={() => handleAddRow(section.id, null)}
            >
              Add Row
            </VscodeButton>
          </div>

          <div
            ref={parentRef}
            className="testPlanSection"
            style={{
              height: "300px", // Adjust height based on your container
              overflowY: "auto", // Enable vertical scrolling
              overflowX: "hidden", // Prevent horizontal scrolling
            }}
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`, // Total height of the virtualized list
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const step = visibleSteps[virtualRow.index];

                const currentStepIndex = section.steps.findIndex(
                  (s) => s.id === step.id
                );

                const doesHaveNestedChildren =
                  section.steps[currentStepIndex + 1]?.nestedLevel >
                  step.nestedLevel;

                const isActiveRow = activeRows?.map(row => row.id).includes(step.id);
                const shouldShowBorderBottom = rowIdToShowBorder === step.id;
                const isRowVisible = isStepVisible(
                  step,
                  virtualRow.index,
                  section.steps,
                  collapsedSteps
                );

                return (
                  <div
                    key={step.id}
                    className={clsx("flex items-center", {
                      ["border-b border-amber-600"]: shouldShowBorderBottom,
                      ["hidden"]: !isRowVisible,
                    })}
                    style={{
                      position: "absolute",
                      top: `${virtualRow.start}px`,
                      left: 0,
                      width: "100%",
                    }}
                  >
                    {doesHaveNestedChildren ? (
                      <div
                        className="cursor-pointer w-1.5 mr-1"
                        onClick={() => toggleCollapse(step.id)}
                      >
                        {collapsedSteps.includes(step.id) ? <p>+</p> : <p>-</p>}
                      </div>
                    ) : (
                      <div className="w-1.5 mr-1" />
                    )}
                    <div
                      className={clsx({
                        ["border border-blue-700 rounded-lg"]: isActiveRow,
                      })}
                    >
                      <TestPlanRow
                        key={step.id}
                        step={step}
                        sectionId={section.id}
                        isRowActive={Boolean(isActiveRow)}
                        handleDeleteRow={handleDeleteRow}
                        handleDuplicateRow={handleDuplicateRow}
                        handleEditCell={handleEditCell}
                        handleRowClick={handleRowClick}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SortableContext>
  );
};
